import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LeaderboardTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-border bg-card">
        <h3 className="text-xl font-semibold mb-2">No runners yet</h3>
        <p className="text-muted-foreground">The leaderboard is currently empty.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 border-border">
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Runner</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">XP</TableHead>
            <TableHead className="text-right">Recent Distance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((profile, index) => {
            // Calculate total distance from runs (just for display purposes if loaded)
            const recentDistance = profile.runs?.reduce((acc: number, run: any) => acc + run.distance_km, 0) || 0

            return (
              <TableRow key={profile.id} className="border-border">
                <TableCell className="text-center font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>{profile.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground">{profile.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    profile.tier === 'Ultrarunner' ? 'default' :
                    profile.tier === 'Racer' ? 'secondary' : 'outline'
                  }>
                    {profile.tier || 'Jogger'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-primary">
                  {profile.xp.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {recentDistance.toFixed(1)} km
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
