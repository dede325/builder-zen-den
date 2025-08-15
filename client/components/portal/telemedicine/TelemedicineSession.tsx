import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  Settings,
  FileText,
  Pill,
  Camera,
  MessageCircle,
  Users,
  Clock,
  Shield,
  Record,
  Download,
  Upload,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { formatDate } from '@/lib/locale-angola-portal';
import { useAuthStore } from '@/store/auth-portal';
import { offlineSyncManager } from '@/lib/offline-sync';

interface Participant {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'nurse' | 'observer';
  avatar?: string;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
}

interface SessionData {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'active' | 'paused' | 'ended';
  type: 'consultation' | 'follow_up' | 'emergency' | 'second_opinion';
  participants: Participant[];
  recordingEnabled: boolean;
  recordingUrl?: string;
  notes: string;
  prescription?: string;
  nextAppointment?: Date;
  encryptionEnabled: boolean;
}

interface TelemedicineSessionProps {
  sessionId: string;
  onSessionEnd?: (sessionData: SessionData) => void;
  className?: string;
}

interface MediaDevices {
  video: MediaDeviceInfo[];
  audio: MediaDeviceInfo[];
}

export default function TelemedicineSession({
  sessionId,
  onSessionEnd,
  className = '',
}: TelemedicineSessionProps) {
  const { user } = useAuthStore();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [availableDevices, setAvailableDevices] = useState<MediaDevices>({ video: [], audio: [] });
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string; timestamp: Date }>>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor' | 'very-poor'>('good');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // WebRTC Configuration (STUN/TURN servers)
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // In production, add TURN servers for NAT traversal
      // {
      //   urls: 'turn:turnserver.com:3478',
      //   username: 'user',
      //   credential: 'pass'
      // }
    ],
    iceCandidatePoolSize: 10,
  };

  // Initialize session
  useEffect(() => {
    initializeSession();
    return () => {
      cleanup();
    };
  }, [sessionId]);

  // Monitor network quality
  useEffect(() => {
    const interval = setInterval(checkNetworkQuality, 5000);
    return () => clearInterval(interval);
  }, []);

  const initializeSession = async () => {
    try {
      // Load session data
      const response = await fetch(`/api/telemedicine/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        setSessionNotes(data.notes || '');
        setPrescription(data.prescription || '');
      }

      // Initialize WebSocket for signaling
      await initializeWebSocket();
      
      // Get available media devices
      await getMediaDevices();
      
      // Initialize local media stream
      await initializeLocalMedia();
      
    } catch (error) {
      console.error('[Telemedicine] Failed to initialize session:', error);
    }
  };

  const initializeWebSocket = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://${window.location.host}/ws/telemedicine/${sessionId}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('[Telemedicine] WebSocket connected');
        setConnectionStatus('connected');
        
        // Authenticate with session
        ws.current?.send(JSON.stringify({
          type: 'join_session',
          sessionId,
          userId: user?.id,
          userRole: user?.role,
        }));
        
        resolve();
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleSignalingMessage(data);
      };

      ws.current.onclose = () => {
        console.log('[Telemedicine] WebSocket disconnected');
        setConnectionStatus('disconnected');
        // Attempt reconnection
        setTimeout(initializeWebSocket, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('[Telemedicine] WebSocket error:', error);
        reject(error);
      };
    });
  };

  const getMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      setAvailableDevices({ video: videoDevices, audio: audioDevices });
      
      if (videoDevices.length > 0) setSelectedVideoDevice(videoDevices[0].deviceId);
      if (audioDevices.length > 0) setSelectedAudioDevice(audioDevices[0].deviceId);
    } catch (error) {
      console.error('[Telemedicine] Failed to get media devices:', error);
    }
  };

  const initializeLocalMedia = async () => {
    try {
      const constraints = {
        video: isVideoEnabled ? {
          deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        } : false,
        audio: isAudioEnabled ? {
          deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to all peer connections
      peerConnections.current.forEach((pc) => {
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      });

    } catch (error) {
      console.error('[Telemedicine] Failed to get user media:', error);
      alert('Erro ao acessar câmera/microfone. Verifique as permissões.');
    }
  };

  const createPeerConnection = (participantId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(rtcConfiguration);
    
    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => new Map(prev.set(participantId, remoteStream)));
      
      if (remoteVideoRef.current && participantId === sessionData?.doctorId) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current?.send(JSON.stringify({
          type: 'ice_candidate',
          candidate: event.candidate,
          targetId: participantId,
        }));
      }
    };

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      console.log(`[Telemedicine] Connection state with ${participantId}:`, pc.connectionState);
      
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('disconnected');
      }
    };

    peerConnections.current.set(participantId, pc);
    return pc;
  };

  const handleSignalingMessage = async (data: any) => {
    switch (data.type) {
      case 'user_joined':
        await handleUserJoined(data);
        break;
      case 'user_left':
        handleUserLeft(data);
        break;
      case 'offer':
        await handleOffer(data);
        break;
      case 'answer':
        await handleAnswer(data);
        break;
      case 'ice_candidate':
        await handleIceCandidate(data);
        break;
      case 'chat_message':
        handleChatMessage(data);
        break;
      case 'session_ended':
        handleSessionEnded(data);
        break;
      default:
        console.log('[Telemedicine] Unknown signaling message:', data.type);
    }
  };

  const handleUserJoined = async (data: { userId: string; userRole: string }) => {
    console.log('[Telemedicine] User joined:', data.userId);
    
    const pc = createPeerConnection(data.userId);
    
    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    ws.current?.send(JSON.stringify({
      type: 'offer',
      offer,
      targetId: data.userId,
    }));
  };

  const handleUserLeft = (data: { userId: string }) => {
    console.log('[Telemedicine] User left:', data.userId);
    
    const pc = peerConnections.current.get(data.userId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(data.userId);
    }
    
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(data.userId);
      return newMap;
    });
  };

  const handleOffer = async (data: { offer: RTCSessionDescriptionInit; senderId: string }) => {
    const pc = createPeerConnection(data.senderId);
    
    await pc.setRemoteDescription(data.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    ws.current?.send(JSON.stringify({
      type: 'answer',
      answer,
      targetId: data.senderId,
    }));
  };

  const handleAnswer = async (data: { answer: RTCSessionDescriptionInit; senderId: string }) => {
    const pc = peerConnections.current.get(data.senderId);
    if (pc) {
      await pc.setRemoteDescription(data.answer);
    }
  };

  const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; senderId: string }) => {
    const pc = peerConnections.current.get(data.senderId);
    if (pc) {
      await pc.addIceCandidate(data.candidate);
    }
  };

  const handleChatMessage = (data: { sender: string; message: string; timestamp: string }) => {
    setChatMessages(prev => [...prev, {
      sender: data.sender,
      message: data.message,
      timestamp: new Date(data.timestamp),
    }]);
  };

  const handleSessionEnded = (data: any) => {
    console.log('[Telemedicine] Session ended by:', data.endedBy);
    endSession();
  };

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        // Notify other participants
        ws.current?.send(JSON.stringify({
          type: 'media_toggle',
          mediaType: 'video',
          enabled: videoTrack.enabled,
        }));
      }
    }
  };

  const toggleAudio = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        // Notify other participants
        ws.current?.send(JSON.stringify({
          type: 'media_toggle',
          mediaType: 'audio',
          enabled: audioTrack.enabled,
        }));
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnections.current.forEach((pc) => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        // Handle screen share end
        videoTrack.addEventListener('ended', () => {
          setIsScreenSharing(false);
          initializeLocalMedia(); // Return to camera
        });
        
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing and return to camera
        await initializeLocalMedia();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('[Telemedicine] Screen sharing error:', error);
    }
  };

  const startRecording = async () => {
    if (!localStream) return;
    
    try {
      recordedChunks.current = [];
      mediaRecorder.current = new MediaRecorder(localStream, {
        mimeType: 'video/webm; codecs=vp9',
      });
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      
      mediaRecorder.current.onstop = async () => {
        const recordedBlob = new Blob(recordedChunks.current, { type: 'video/webm' });
        await uploadRecording(recordedBlob);
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
      
      // Update session data
      setSessionData(prev => prev ? { ...prev, recordingEnabled: true } : null);
      
    } catch (error) {
      console.error('[Telemedicine] Recording error:', error);
      alert('Erro ao iniciar gravação');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecording = async (recordingBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('recording', recordingBlob, `session_${sessionId}_${Date.now()}.webm`);
      formData.append('sessionId', sessionId);
      
      const response = await fetch('/api/telemedicine/recordings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setSessionData(prev => prev ? { ...prev, recordingUrl: result.url } : null);
        console.log('[Telemedicine] Recording uploaded:', result.url);
      }
    } catch (error) {
      console.error('[Telemedicine] Failed to upload recording:', error);
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    ws.current?.send(JSON.stringify({
      type: 'chat_message',
      message: chatMessage,
      sender: user?.name,
      timestamp: new Date().toISOString(),
    }));
    
    setChatMessage('');
  };

  const endSession = async () => {
    try {
      // Stop recording if active
      if (isRecording) {
        stopRecording();
      }
      
      // Save session data
      const sessionEndData = {
        ...sessionData,
        endTime: new Date(),
        status: 'ended' as const,
        notes: sessionNotes,
        prescription,
      };
      
      // Save to server
      await fetch(`/api/telemedicine/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
        body: JSON.stringify(sessionEndData),
      });
      
      // Store offline for sync
      await offlineSyncManager.storeOfflineData('consultation_notes', {
        sessionId,
        notes: sessionNotes,
        prescription,
        endTime: new Date(),
      }, 'high');
      
      // Notify WebSocket
      ws.current?.send(JSON.stringify({
        type: 'end_session',
        sessionId,
      }));
      
      onSessionEnd?.(sessionEndData);
      
    } catch (error) {
      console.error('[Telemedicine] Failed to end session:', error);
    } finally {
      cleanup();
    }
  };

  const cleanup = () => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    
    // Close WebSocket
    if (ws.current) {
      ws.current.close();
    }
    
    // Stop recording
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
    }
  };

  const checkNetworkQuality = () => {
    // Simple network quality check based on connection state
    const connectedPeers = Array.from(peerConnections.current.values())
      .filter(pc => pc.connectionState === 'connected');
    
    if (connectedPeers.length === 0) {
      setNetworkQuality('very-poor');
    } else {
      // In a real implementation, check RTCStats for bandwidth, packet loss, etc.
      setNetworkQuality('good');
    }
  };

  const getNetworkQualityColor = () => {
    switch (networkQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-yellow-600';
      case 'very-poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-clinic-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full bg-gray-900 text-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Teleconsulta</h2>
          <Badge variant="secondary">
            {sessionData.type}
          </Badge>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className={getNetworkQualityColor()}>
              {connectionStatus === 'connected' ? 'Conectado' : 
               connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {formatDate(sessionData.startTime, 'time')}
          </span>
          {sessionData.encryptionEnabled && (
            <Shield className="h-4 w-4 text-green-500" title="Criptografado" />
          )}
        </div>
      </div>

      <div className="flex h-full">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover bg-gray-800"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12"
            >
              {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12"
            >
              {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "secondary" : "default"}
              size="sm"
              onClick={toggleScreenShare}
              className="rounded-full w-12 h-12"
            >
              {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isMuted ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full w-12 h-12"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            
            {user?.role === 'doctor' && (
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className="rounded-full w-12 h-12"
              >
                <Record className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              onClick={endSession}
              className="rounded-full w-12 h-12"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-medium">Chat da Sessão</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg, index) => (
                <div key={index} className="bg-gray-700 rounded p-2 text-sm">
                  <div className="font-medium text-blue-400">{msg.sender}</div>
                  <div>{msg.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(msg.timestamp, 'time')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Escrever mensagem..."
                  className="bg-gray-700 border-gray-600"
                />
                <Button onClick={sendChatMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Notes Section (for doctors) */}
          {user?.role === 'doctor' && (
            <div className="border-t border-gray-700">
              <Button
                variant="ghost"
                onClick={() => setShowNotes(!showNotes)}
                className="w-full p-4 justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Notas da Consulta
              </Button>
              
              {showNotes && (
                <div className="p-4 space-y-4">
                  <Textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Notas da consulta..."
                    className="bg-gray-700 border-gray-600 min-h-20"
                  />
                  
                  <Textarea
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    placeholder="Prescrição médica..."
                    className="bg-gray-700 border-gray-600 min-h-16"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
