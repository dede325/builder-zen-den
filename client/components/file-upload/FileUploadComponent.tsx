import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Upload,
  File,
  Image,
  FileText,
  Trash2,
  Download,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Plus,
  FolderOpen,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: string;
  url: string;
  thumbnailUrl?: string;
  compressedUrl?: string;
}

interface FileUploadProps {
  category?: 'document' | 'image' | 'exam_result' | 'profile_picture' | 'other';
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  onUploadComplete?: (files: UploadedFile[]) => void;
  showFileList?: boolean;
}

export default function FileUploadComponent({
  category = 'other',
  accept = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx',
  maxFiles = 5,
  maxFileSize = 10,
  onUploadComplete,
  showFileList = true
}: FileUploadProps) {
  const { user } = useAuthStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [userFiles, setUserFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user files on component mount
  React.useEffect(() => {
    if (user && showFileList) {
      loadUserFiles();
    }
  }, [user, showFileList]);

  const loadUserFiles = async () => {
    try {
      const response = await fetch(`/api/files/user/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserFiles(data.data || []);
      }
    } catch (error) {
      console.error('Error loading user files:', error);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileSelection(files);
  };

  const handleFileSelection = (files: File[]) => {
    // Validate file count
    if (files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Alguns arquivos excedem o limite de ${maxFileSize}MB`);
      return;
    }

    setSelectedFiles(files);
  };

  const uploadFiles = async () => {
    if (!user || selectedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('userId', user.id);
    formData.append('category', category);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const newFiles = data.data || [];
        
        setUploadedFiles(prev => [...prev, ...newFiles]);
        setSelectedFiles([]);
        
        if (showFileList) {
          await loadUserFiles();
        }
        
        if (onUploadComplete) {
          onUploadComplete(newFiles);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Erro ao fazer upload dos arquivos');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id })
      });

      if (response.ok) {
        setUserFiles(prev => prev.filter(file => file.id !== fileId));
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimeType === 'application/pdf') return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      document: 'bg-blue-100 text-blue-800',
      image: 'bg-green-100 text-green-800',
      exam_result: 'bg-purple-100 text-purple-800',
      profile_picture: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload de Arquivos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            )}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Máximo {maxFiles} arquivos, até {maxFileSize}MB cada
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Selecionar Arquivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept={accept}
              onChange={handleFileInputChange}
            />
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Arquivos Selecionados</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFiles([])}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={uploadFiles}
                  disabled={isUploading}
                >
                  {isUploading ? 'Enviando...' : 'Enviar Arquivos'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      {showFileList && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5" />
              <span>Meus Arquivos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="image">Imagens</TabsTrigger>
                <TabsTrigger value="document">Documentos</TabsTrigger>
                <TabsTrigger value="exam_result">Exames</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <FileList files={userFiles} onDelete={deleteFile} />
              </TabsContent>

              <TabsContent value="image" className="mt-4">
                <FileList 
                  files={userFiles.filter(f => f.category === 'image')} 
                  onDelete={deleteFile} 
                />
              </TabsContent>

              <TabsContent value="document" className="mt-4">
                <FileList 
                  files={userFiles.filter(f => f.category === 'document')} 
                  onDelete={deleteFile} 
                />
              </TabsContent>

              <TabsContent value="exam_result" className="mt-4">
                <FileList 
                  files={userFiles.filter(f => f.category === 'exam_result')} 
                  onDelete={deleteFile} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface FileListProps {
  files: UploadedFile[];
  onDelete: (fileId: string) => void;
}

function FileList({ files, onDelete }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Nenhum arquivo encontrado</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimeType === 'application/pdf') return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      document: 'bg-blue-100 text-blue-800',
      image: 'bg-green-100 text-green-800',
      exam_result: 'bg-purple-100 text-purple-800',
      profile_picture: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {files.map(file => (
        <Card key={file.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt={file.originalName}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    {getFileIcon(file.mimeType)}
                  </div>
                )}
              </div>
              <Badge className={getCategoryColor(file.category)}>
                {file.category}
              </Badge>
            </div>
            
            <h4 className="font-medium text-sm mb-1 truncate" title={file.originalName}>
              {file.originalName}
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              {formatFileSize(file.fileSize)}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" asChild>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-3 h-3" />
                  </a>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <a href={file.url} download>
                    <Download className="w-3 h-3" />
                  </a>
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(file.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
