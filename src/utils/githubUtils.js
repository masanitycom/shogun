// src/utils/githubUtils.js

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO_OWNER = 'masanitycom';
const REPO_NAME = 'shogun';

export const fetchGithubCode = async (path) => {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3.raw'
                }
            }
        );

        if (!response.ok) {
            throw new Error('GitHubからのデータ取得に失敗しました');
        }

        const data = await response.json();
        return atob(data.content); // Base64デコード
    } catch (error) {
        console.error('GitHub APIエラー:', error);
        throw error;
    }
};
