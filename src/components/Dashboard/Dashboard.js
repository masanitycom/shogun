import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "../Layout/Layout';
import Home from "../Pages/Home';

export default function Dashboard() {
    // ユーザーの認証状態を管理するstate
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // ページ読み込み時に認証状態をチェック
        checkAuthStatus();
    }, []);

    // 認証状態をチェックする関数
    const checkAuthStatus = () => {
        // ここに認証チェックのロジックを実装
        // 例: localStorage、JWT、セッションなどをチェック
    };

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* 他のルートをここに追加 */}
                </Routes>
            </Layout>
        </Router>
    );
}
