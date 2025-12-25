import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Crown, Trophy, Medal, Award, ArrowLeft, Vote } from "lucide-react";
import type { Student } from "@shared/schema";

export default function Leaderboard() {
  const { t, isRTL } = useTranslation();
  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
    refetchInterval: 5000,
  });

  const sortedStudents = [...students].sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = students.reduce((sum, s) => sum + s.voteCount, 0);
  const maxVotes = sortedStudents[0]?.voteCount || 1;

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500 trophy-animation" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-semibold">{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            1st
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">
            2nd
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-amber-600/20 text-amber-600 border-amber-600/30">
            3rd
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-background particles-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-primary/20 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
                <Crown className="w-6 h-6 text-primary" />
                <span className="font-semibold text-foreground hidden sm:inline">{t('appName')}</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="button-back-home">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                  {t('backToHome')}
                </Button>
              </Link>
              <Link href="/vote">
                <Button size="sm" data-testid="button-vote-now">
                  <Vote className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('voteButton')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary trophy-animation" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            <span className="gold-gradient-text">{t('leaderboardTitle')}</span>
          </h1>
          <p className="text-muted-foreground">
            {t('leaderboardSubtitle')}
          </p>
          {totalVotes > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <Vote className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {totalVotes} {t('votes')}
              </span>
            </div>
          )}
        </div>

        {/* Top 3 Podium (Desktop) */}
        {!isLoading && sortedStudents.length >= 3 && (
          <div className="hidden md:flex justify-center items-end gap-4 mb-12 max-w-3xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <Card className="bg-card border-gray-400/30 p-6 text-center w-48">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full ring-2 ring-gray-400/50 ring-offset-2 ring-offset-card overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={sortedStudents[1]?.photoUrl || undefined} />
                    <AvatarFallback className="bg-gray-400/10 text-gray-400 font-semibold">
                      {getInitials(sortedStudents[1]?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Medal className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground truncate" data-testid="text-second-place-name">
                  {sortedStudents[1]?.name}
                </h3>
                <p className="text-2xl font-bold text-gray-400 mt-1" data-testid="text-second-place-votes">
                  {sortedStudents[1]?.voteCount}
                </p>
                <p className="text-xs text-muted-foreground">{t('votes')}</p>
              </Card>
              <div className="w-full h-24 bg-gray-400/20 rounded-t-lg mt-2" />
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <Card className="bg-card border-yellow-500/30 p-6 text-center w-56 gold-glow">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-card overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={sortedStudents[0]?.photoUrl || undefined} />
                    <AvatarFallback className="bg-yellow-500/10 text-yellow-500 text-lg font-semibold">
                      {getInitials(sortedStudents[0]?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2 trophy-animation" />
                <h3 className="text-lg font-semibold text-foreground truncate" data-testid="text-first-place-name">
                  {sortedStudents[0]?.name}
                </h3>
                <p className="text-3xl font-bold text-yellow-500 mt-1" data-testid="text-first-place-votes">
                  {sortedStudents[0]?.voteCount}
                </p>
                <p className="text-xs text-muted-foreground">{t('votes')}</p>
              </Card>
              <div className="w-full h-32 bg-yellow-500/20 rounded-t-lg mt-2" />
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <Card className="bg-card border-amber-600/30 p-6 text-center w-48">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full ring-2 ring-amber-600/50 ring-offset-2 ring-offset-card overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={sortedStudents[2]?.photoUrl || undefined} />
                    <AvatarFallback className="bg-amber-600/10 text-amber-600 font-semibold">
                      {getInitials(sortedStudents[2]?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground truncate" data-testid="text-third-place-name">
                  {sortedStudents[2]?.name}
                </h3>
                <p className="text-2xl font-bold text-amber-600 mt-1" data-testid="text-third-place-votes">
                  {sortedStudents[2]?.voteCount}
                </p>
                <p className="text-xs text-muted-foreground">{t('votes')}</p>
              </Card>
              <div className="w-full h-16 bg-amber-600/20 rounded-t-lg mt-2" />
            </div>
          </div>
        )}

        {/* Full Ranking List */}
        <Card className="max-w-3xl mx-auto bg-card border-primary/20">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-primary" />
              {t('rank')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y divide-primary/10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : sortedStudents.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{t('noEntries')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('noEntriesDesc')}
                </p>
                <Link href="/submit">
                  <Button data-testid="button-join-challenge">
                    {t('joinChallenge')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-primary/10">
                {sortedStudents.map((student, index) => {
                  const rank = index + 1;
                  const percentage = totalVotes > 0 ? (student.voteCount / maxVotes) * 100 : 0;

                  return (
                    <div
                      key={student.id}
                      className={`flex items-center gap-4 p-4 transition-colors ${
                        rank <= 3 ? "bg-primary/5" : ""
                      }`}
                      data-testid={`row-student-${student.id}`}
                    >
                      <div className="w-8 flex items-center justify-center">
                        {getRankIcon(rank)}
                      </div>

                      <div className="w-12 h-12 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-card overflow-hidden">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={student.photoUrl || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground truncate">
                            {student.name}
                          </h3>
                          {getRankBadge(rank)}
                        </div>
                        <div className="mt-2">
                          <Progress
                            value={percentage}
                            className="h-2 bg-muted"
                          />
                        </div>
                      </div>

                      <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                        <p className="text-lg font-bold text-primary">
                          {student.voteCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('votes')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
