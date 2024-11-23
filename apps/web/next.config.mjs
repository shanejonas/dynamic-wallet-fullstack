/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.CI ? '/dynamic-wallet-fullstack' : '',
};

export default nextConfig;
