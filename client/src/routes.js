import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { CalendarPage } from './pages/CalendarPage'

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/api/calendar' exact>
                    <CalendarPage />
                </Route>
                <Redirect to='/api/calendar' />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path='/api/auth' exact>
                <AuthPage />
            </Route>
            <Redirect to='/api/auth' />
        </Switch>
    )
}