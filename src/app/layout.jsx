'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import AuthProvider from './(auth)/authProvider';
import '../app/globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                <Provider store={store}>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </Provider>
            </body>
        </html>
    );
}