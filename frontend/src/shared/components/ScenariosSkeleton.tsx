'use client';
import { Box, Grid, Paper, Stack, Skeleton } from '@mui/material';

export const ScenariosSkeleton = () => {
  return (
    <>

      {/* KPI Cards Skeletons */}
      <Grid component="div" container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: '100%',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton variant="rounded" width={60} height={20} />
              </Stack>
              <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Skeleton variant="text" width="30%" height={16} sx={{ mb: 0.5 }} />
                <Skeleton variant="rounded" width={40} height={18} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Chart & Controls Skeletons */}
      <Grid component="div" container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              height: 540,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={200} height={24} />
              </Box>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={100} height={20} />
              </Box>
            </Box>
            {/* Simulated chart area */}
            <Box sx={{ width: '100%', height: 'calc(100% - 64px)', display: 'flex', alignItems: 'flex-end', px: 2, pb: 2 }}>
              <Skeleton variant="rectangular" width="100%" height="80%" sx={{ borderRadius: 2 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              minHeight: 540,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', mb: 3 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={150} height={30} />
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="20%" height={20} />
                  </Stack>
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ my: 1, borderRadius: 1 }} />
                </Box>
              ))}
            </Stack>
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="40%" />
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="20%" />
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
