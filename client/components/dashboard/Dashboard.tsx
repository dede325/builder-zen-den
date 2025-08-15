import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { useMedicalStore } from '@/store/medical';
import {
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Heart,
  Users,
  Phone,
  MapPin,
  Download,
  Eye,
  ArrowRight,
  Bell,
  Stethoscope
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { 
    appointments, 
    examResults, 
    messages, 
    invoices,
    fetchAppointments,
    fetchExamResults,
    fetchMessages,
    fetchInvoices
  } = useMedicalStore();

  useEffect(() => {
    if (user) {
      fetchAppointments(user.id);
      fetchExamResults(user.id);
      fetchMessages(user.id);
      fetchInvoices(user.id);
    }
  }, [user, fetchAppointments, fetchExamResults, fetchMessages, fetchInvoices]);

  if (!user) {
    return null;
  }

  // Calcular estatísticas
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.date) >= new Date()
  ).length;
  
  const completedAppointments = appointments.filter(apt => 
    apt.status === 'completed'
  ).length;
  
  const unreadMessages = messages.filter(msg => !msg.read).length;
  const newExamResults = examResults.filter(exam => !exam.viewed).length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent').length;

  // Próximas consultas
  const nextAppointments = appointments
    .filter(apt => apt.status === 'scheduled' && new Date(`${apt.date}T${apt.time}`) >= new Date())
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 3);

  // Exames recentes
  const recentExams = examResults
    .sort((a, b) => new Date(b.resultDate || b.examDate).getTime() - new Date(a.resultDate || a.examDate).getTime())
    .slice(0, 3);

  // Mensagens recentes
  const recentMessages = messages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getStatusBadge = (status: string, type: 'appointment' | 'exam' | 'invoice') => {
    const badges = {
      appointment: {
        scheduled: { label: 'Agendada', variant: 'default' as const },
        confirmed: { label: 'Confirmada', variant: 'default' as const },
        completed: { label: 'Concluída', variant: 'secondary' as const },
        cancelled: { label: 'Cancelada', variant: 'destructive' as const }
      },
      exam: {
        pending: { label: 'Pendente', variant: 'default' as const },
        in_progress: { label: 'Em Andamento', variant: 'default' as const },
        final: { label: 'Finalizado', variant: 'secondary' as const }
      },
      invoice: {
        draft: { label: 'Rascunho', variant: 'outline' as const },
        sent: { label: 'Enviada', variant: 'default' as const },
        paid: { label: 'Paga', variant: 'secondary' as const },
        overdue: { label: 'Vencida', variant: 'destructive' as const }
      }
    };

    const badge = badges[type]?.[status as keyof typeof badges[typeof type]];
    return badge ? { label: badge.label, variant: badge.variant } : { label: status, variant: 'outline' as const };
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-blue-100">
              Aqui você pode acompanhar suas consultas, exames e muito mais.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Próximas Consultas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {upcomingAppointments}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Novos Exames
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {newExamResults}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            {newExamResults > 0 && (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {newExamResults} resultado(s) disponível(is)
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Mensagens
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unreadMessages}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            {unreadMessages > 0 && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                {unreadMessages} não lida(s)
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Faturas Pendentes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingInvoices}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Próximas Consultas
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/portal/appointments">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {nextAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma consulta agendada</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/portal/appointments">Agendar Consulta</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {nextAppointments.map((appointment) => {
                  const badge = getStatusBadge(appointment.status, 'appointment');
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {appointment.doctorName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.specialty}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(appointment.date)} às {formatTime(appointment.time)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exames Recentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Exames Recentes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/portal/exams">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentExams.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum exame disponível</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentExams.map((exam) => {
                  const badge = getStatusBadge(exam.status, 'exam');
                  return (
                    <div key={exam.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          exam.viewed ? 'bg-gray-100 dark:bg-gray-800' : 'bg-purple-100 dark:bg-purple-900'
                        }`}>
                          {exam.viewed ? (
                            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {exam.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exam.type}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(exam.resultDate || exam.examDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                        {!exam.viewed && (
                          <Badge variant="destructive" className="text-xs">Novo</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mensagens e Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mensagens Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
                Mensagens Recentes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/portal/messages">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma mensagem</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className={`p-4 border rounded-lg ${
                    message.read 
                      ? 'border-gray-200 dark:border-gray-700' 
                      : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {message.fromUserName}
                        </p>
                        {!message.read && (
                          <Badge variant="destructive" className="text-xs">Nova</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Contato da Clínica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-xs text-gray-500">+244 945 344 650</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Endereço</p>
                  <p className="text-xs text-gray-500">Av. 21 de Janeiro, 351, Benfica</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Horário</p>
                  <p className="text-xs text-gray-500">Seg-Sex: 07:00-19:00</p>
                  <p className="text-xs text-gray-500">Sáb: 07:00-13:00</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button size="sm" className="w-full" asChild>
                <Link to="/portal/messages">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
