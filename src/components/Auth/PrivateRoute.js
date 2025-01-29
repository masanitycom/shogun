// src/components/Auth/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const PrivateRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // 現在のセッションを取得
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // セッションの変更を監視
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // ローディング中はnullを返す
    if (loading) {
        return null; // またはローディングスピナーなどを表示
    }

    // セッションがない場合はログインページにリダイレクト
    if (!session) {
        return <Navigate to="/" replace />;
    }

    // 認証済みの場合は子コンポーネントを表示
    return children;
};

export default PrivateRoute;
