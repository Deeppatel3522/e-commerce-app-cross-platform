import React, { useState } from 'react'
import { userAuthentication } from '../config/userAuthentication'
import LoginStack from './LoginStack'
import WelcomeStack from './WelcomeStack'


export default function RootNavigation() {
    
    const { user } = userAuthentication()

    return user ? <WelcomeStack /> : <LoginStack />
}