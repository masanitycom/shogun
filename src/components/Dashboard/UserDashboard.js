import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    useMediaQuery,
    useTheme,
    ButtonBase,
    Avatar
} from '@mui/material';
import {
    AccountCircle as AccountIcon,
    Notifications as NotificationsIcon,
    Assignment as AssignmentIcon,
    Payment as PaymentIcon,
    Help as HelpIcon
} from '@mui/icons-material';
import { supabase } from '../../utils/supabaseClient';

// メニューアイテムコンポーネント
function MenuCard({ icon, title, description, onClick }) {
    return (
        <Card
            sx={{
                height: '100%',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                }
            }}
        >
            <ButtonBase
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    textAlign: 'left'
                }}
                onClick={onClick}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {icon}
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                ml: 1,
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '1rem' }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </ButtonBase>
        </Card>
    );
}

function UserDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState([]);

    async function getUserData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setUserData(data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    useEffect(() => {
        getUserData();

        const subscription = supabase
            .channel('public:profiles')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles'
                },
                payload => {
                    if (payload.new.id === userData?.id) {
                        setUserData(payload.new);
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [userData?.id]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* ユーザー情報ヘッダー */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    borderRadius: 2
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: theme.palette.primary.light
                            }}
                        >
                            <AccountIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {userData?.user_id}さん
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            今日も元気に頑張りましょう！
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* メインメニュー */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <MenuCard
                        icon={<AccountIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />}
                        title="プロフィール"
                        description="個人情報の確認・変更"
                        onClick={() => {/* navigation logic */ }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MenuCard
                        icon={<NotificationsIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />}
                        title="お知らせ"
                        description="最新のお知らせをチェック"
                        onClick={() => {/* navigation logic */ }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MenuCard
                        icon={<AssignmentIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />}
                        title="実績"
                        description="あなたの活動実績"
                        onClick={() => {/* navigation logic */ }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MenuCard
                        icon={<PaymentIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />}
                        title="報酬確認"
                        description="報酬の確認・履歴"
                        onClick={() => {/* navigation logic */ }}
                    />
                </Grid>
            </Grid>

            {/* ヘルプボタン（モバイル用固定位置） */}
            {isMobile && (
                <IconButton
                    sx={{
                        position: 'fixed',
                        right: 16,
                        bottom: 16,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                        width: 64,
                        height: 64,
                    }}
                >
                    <HelpIcon sx={{ fontSize: 32 }} />
                </IconButton>
            )}
        </Container>
    );
}

export default UserDashboard;
