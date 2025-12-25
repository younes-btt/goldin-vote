import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAdminStore } from "@/lib/auth";
import { useTranslation } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Crown, Lock, LogOut, Users, Vote, Trophy, Trash2, RefreshCw } from "lucide-react";
import type { Student, Voter } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, login, logout } = useAdminStore();
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState<"students" | "voters">("students");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response;
    },
    onSuccess: () => {
      login();
      toast({
        title: t('voteSuccess'),
        description: t('adminTitle'),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('loginFailed'),
        description: error.message || t('invalidCredentials'),
      });
    },
  });

  const { data: students = [], isLoading: studentsLoading, refetch: refetchStudents } = useQuery<Student[]>({
    queryKey: ["/api/students"],
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const { data: voters = [], isLoading: votersLoading, refetch: refetchVoters } = useQuery<Voter[]>({
    queryKey: ["/api/voters"],
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: t('deleteStudent'),
        description: t('voteSuccessDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('submissionFailed'),
        description: error.message,
      });
    },
  });

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: t('logout'),
      description: t('voteSuccessDesc'),
    });
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedStudents = [...students].sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = students.reduce((sum, s) => sum + s.voteCount, 0);
  const votedCount = voters.filter((v) => v.hasVoted).length;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-background particles-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <header className="border-b border-primary/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
                  <Crown className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-foreground">{t('appName')}</span>
                </div>
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
                <span className="gold-gradient-text">{t('adminTitle')}</span>
              </h1>
              <p className="text-muted-foreground">
                {t('adminSubtitle')}
              </p>
            </div>

            <Card className="bg-card border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-foreground">{t('adminLoginTitle')}</CardTitle>
                <CardDescription>
                  {t('adminLoginDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onLogin)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t('username')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('username')}
                              className="bg-background border-primary/30 focus:border-primary"
                              data-testid="input-admin-username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t('password')}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('password')}
                              className="bg-background border-primary/30 focus:border-primary"
                              data-testid="input-admin-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full font-semibold"
                      disabled={loginMutation.isPending}
                      data-testid="button-admin-login"
                    >
                      {loginMutation.isPending ? (
                        <span className="animate-pulse">{t('loggingIn')}</span>
                      ) : (
                        <>
                          <Lock className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('loginAsAdmin')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="border-b border-primary/20 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
                <Crown className="w-6 h-6 text-primary" />
                <span className="font-semibold text-foreground hidden sm:inline">{t('appName')}</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Badge variant="outline" className="border-primary/30 text-foreground">
                <Lock className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('adminLogin')}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground"
                data-testid="button-logout"
              >
                <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">
            <span className="gold-gradient-text">{t('adminTitle')}</span>
          </h1>
          <p className="text-muted-foreground">
            {t('adminSubtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-card border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-students">
                    {students.length}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('totalStudents')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Vote className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-votes">
                    {totalVotes}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('totalVotes')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-voters">
                    {voters.length}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('totalVoters')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-voted-count">
                    {votedCount}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('totalVotes')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={activeTab === "students" ? "default" : "outline"}
            onClick={() => setActiveTab("students")}
            className={activeTab === "students" ? "" : "border-primary/30"}
            data-testid="tab-students"
          >
            <Users className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('participantsOverview')}
          </Button>
          <Button
            variant={activeTab === "voters" ? "default" : "outline"}
            onClick={() => setActiveTab("voters")}
            className={activeTab === "voters" ? "" : "border-primary/30"}
            data-testid="tab-voters"
          >
            <Vote className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('votersOverview')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              refetchStudents();
              refetchVoters();
            }}
            className={`border-primary/30 ${isRTL ? 'mr-auto' : 'ml-auto'}`}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('loading')}
          </Button>
        </div>

        {/* Students Table */}
        {activeTab === "students" && (
          <Card className="bg-card border-primary/20">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="w-5 h-5 text-primary" />
                {t('participantsOverview')} ({students.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {studentsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : sortedStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('noEntries')}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/20">
                      <TableHead className="text-muted-foreground">{t('rank')}</TableHead>
                      <TableHead className="text-muted-foreground">{t('student')}</TableHead>
                      <TableHead className="text-muted-foreground">{t('votesColumn')}</TableHead>
                      <TableHead className="text-muted-foreground">{t('active')}</TableHead>
                      <TableHead className={`text-muted-foreground ${isRTL ? 'text-left' : 'text-right'}`}>{t('deleteStudent')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.map((student, index) => (
                      <TableRow key={student.id} className="border-primary/10">
                        <TableCell className="font-semibold text-primary">
                          #{index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-1 ring-primary/30">
                              <AvatarImage src={student.photoUrl || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {getInitials(student.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{student.name}</p>
                              {student.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {student.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-lg font-bold text-primary">
                            {student.voteCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.isActive ? "default" : "secondary"}
                            className={student.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                          >
                            {student.isActive ? t('active') : t('active')}
                          </Badge>
                        </TableCell>
                        <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteStudentMutation.mutate(student.id)}
                            disabled={deleteStudentMutation.isPending}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-${student.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Voters Table */}
        {activeTab === "voters" && (
          <Card className="bg-card border-primary/20">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Vote className="w-5 h-5 text-primary" />
                {t('votersOverview')} ({voters.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {votersLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : voters.length === 0 ? (
                <div className="text-center py-12">
                  <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('noEntries')}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/20">
                      <TableHead className="text-muted-foreground">{t('voter')}</TableHead>
                      <TableHead className="text-muted-foreground">{t('email')}</TableHead>
                      <TableHead className="text-muted-foreground">{t('active')}</TableHead>
                      <TableHead className="text-muted-foreground">{t('votedFor')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voters.map((voter) => {
                      const votedStudent = students.find((s) => s.id === voter.votedForId);
                      return (
                        <TableRow key={voter.id} className="border-primary/10">
                          <TableCell className="font-medium text-foreground">
                            {voter.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {voter.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={voter.hasVoted ? "default" : "outline"}
                              className={voter.hasVoted ? "bg-primary/20 text-primary border-primary/30" : "border-muted-foreground/30"}
                            >
                              {voter.hasVoted ? t('voteCast') : t('hasNotVoted')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {votedStudent ? votedStudent.name : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
