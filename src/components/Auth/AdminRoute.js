// src/components/Auth/AdminRoute.js
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            // 現在のセッションを取得
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            // プロフィールから管理者権限をチェック
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;

            setIsAdmin(profile.user_type === 'admin');
        } catch (error) {
            console.error('Admin check error:', error.message);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    // ローディング中
    if (loading) {
        return null; // またはローディングスピナーを表示
    }

    // 管理者でない場合はトップページにリダイレクト
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    // 管理者の場合は子コンポーネントを表示
    return children;
};

export default AdminRoute;
