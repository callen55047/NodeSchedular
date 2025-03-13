import React, { FormEvent, useContext, useState } from 'react'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import '../../theme/theme.css'
import { AppVersionBottomRight, HorizontalSpacer, SInput, VerticalSpacer } from '../components/ViewElements'
import {
  ForgotPasswordButton,
  LoginButton,
  LoginContainer,
  LoginContentContainer,
  LoginImage
} from './LoginViewComps'
import { SequenceContext } from '../../appEntry/sequenceController/SequenceContext'
import { ErrorTextBlock } from '../components/HorizontalMessageBox'
import { SCheckBox } from '../components/Inputs'
import { FlexBox } from '../components/view/FlexLayouts'
import { ITokenAuth, PORTAL_USER_TYPES } from '../../internal/models/Account'
import { BaseText } from '../../theme/CustomText'

interface ILoginViewProps {
  onLoginSuccess: (auth: ITokenAuth) => void,
}
export default function LoginView(props: ILoginViewProps) {
  const { api, runBlocking, logger } = useContext(AppInstance)
  const { onLoginSuccess } = props
  const [error, setError] = useState<string | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    password: '',
    password2: ''
  })

  function updateUserValue(field: string, value: string) {
    setUserInfo({ ...userInfo, [field]: value })
  }

  const login = async (e: FormEvent) => {
    e?.preventDefault()
    setError('')

    runBlocking(async () => {
      const userAuth = await api.auth.login({ ...userInfo })
      if (userAuth) {
        // ONLY ARTISTS CAN ACCESS THIS PORTAL
        if (!PORTAL_USER_TYPES.includes(userAuth.role)) {
          logger.info(`email: ${userInfo.email}, role: ${userAuth.role} blocked from artist portal login.`)
          setError('Account type is not valid for this portal')
          return
        }
        onLoginSuccess(userAuth)
      } else {
        setError('ATTENTION: Email & password combination not found')
      }
    })
  }

  const forgotPassword = async () => {
    const newTab = window.open('/forgot-password', '_blank')
    if (newTab) {
      newTab.focus()
    } else {
      window.alert('Browser has blocked opening a new tab.')
    }
  }

  const register = async () => {
    // TODO: need password complexity & confirmation service
    if (userInfo.password !== userInfo.password2) {
      setError('Uh Oh! Passwords do not match')
      return
    }

    if (!isChecked) {
      setError('You must agree to the Node Schedular Terms of Service')
      return
    }

    setError('')
    runBlocking(async () => {
      const auth = await api.auth.registerUser(userInfo)
      if (auth) {
        onLoginSuccess(auth)
      } else {
        setError('ERROR: Could not register account. Please try again later.')
      }
    })
  }

  return (
    <LoginContainer>
      <LoginImage />
      <BaseText text={"Beta"} size={22} alignment={'center'} />

      {error && <ErrorTextBlock text={error} />}

      <LoginContentContainer>

        {/*child #0*/}
        <form onSubmit={login} style={{display: 'flex', flexDirection: 'column'}}>
          <SInput
            value={userInfo.email}
            placeholder={'Email address'}
            onChange={(value) => updateUserValue('email', value)}
          />
          <VerticalSpacer size={30} />
          <SInput
            value={userInfo.password}
            placeholder={'Password'}
            onChange={(value) => updateUserValue('password', value)}
            type="password"
          />
          <VerticalSpacer size={30} />
          <LoginButton onLogin={login} text={'SIGN IN'} />
          <VerticalSpacer size={30} />
          <ForgotPasswordButton onForgotPassword={forgotPassword} />
        </form>

        {/*child #1*/}
        <React.Fragment>
          <SInput
            value={userInfo.email}
            placeholder={'Email'}
            onChange={(value) => updateUserValue('email', value)}
          />
          <VerticalSpacer size={30} />
          <SInput
            value={userInfo.username}
            placeholder={'Username'}
            onChange={(value) => updateUserValue('username', value)}
          />
          <VerticalSpacer size={30} />
          <SInput
            value={userInfo.password}
            placeholder={'Password'}
            onChange={(value) => updateUserValue('password', value)}
            type="password"
          />
          <VerticalSpacer size={30} />
          <SInput
            value={userInfo.password2}
            placeholder={'Confirm password'}
            onChange={(value) => updateUserValue('password2', value)}
            type="password"
          />
          <VerticalSpacer size={30} />
          <FlexBox justify={'center'}>
            <p style={{ color: 'white', fontSize: 14, margin: 0, alignSelf: 'center' }}>
              Agree to the <a href="https://domain.com/termsofservice" target="_blank">Terms of Service</a>
            </p>
            <HorizontalSpacer size={10} />
            <SCheckBox
              text={''}
              checked={isChecked}
              onChange={setIsChecked}
            />
          </FlexBox>
          <VerticalSpacer size={30} />
          <LoginButton onLogin={register} text={'REGISTER'} />
        </React.Fragment>
      </LoginContentContainer>
      <AppVersionBottomRight />
    </LoginContainer>
  )
}