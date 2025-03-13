import React, {useState} from "react"
import {Colors} from "../../theme/Theme";
import {VerticalSpacer} from "../components/ViewElements";
import {RChildren} from "../../types/GenericTypes";
import LocalImages from '../images/LocalImages'

const LoginImage = () => {
    return <img
        src={LocalImages.BANNER_LOGO}
        style={{maxHeight: 142, margin: "0 150px"}}
        alt={"banner"}
    />
}

const LoginContainer = ({children}: RChildren) => {
    return (
        <div className="login-root" style={{
        display: "flex",
        justifyContent: "center"
    }}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }}>
            <div className="login-container" style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: Colors.DARK_00,
                borderRadius: 10,
                overflow: "hidden"
            }}>
                {children}
            </div>
        </div>
    </div>
    )
}

const LoginContentContainer = ({children}: RChildren) => {
    const [isSignIn, setIsSignIn] = useState(true)

    const ComponentTab = ({isActive, text}: {isActive: boolean, text: string}) => {
        return <text
            style={{
                textDecoration: isActive ? "underline" : undefined,
                cursor: "pointer"
        }}
            onClick={() => setIsSignIn(!isSignIn)}>
            {text}
        </text>
    }


    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            margin: "0 125px 40px"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                color: "white"
            }}>
                <ComponentTab text={"Sign in"} isActive={isSignIn} />
                <ComponentTab text={"Register"} isActive={!isSignIn} />
            </div>
            <VerticalSpacer size={30} />
            {/*@ts-ignore*/}
            {isSignIn ? children[0]! : children[1]!}
        </div>
    )
}

const LoginButton = ({onLogin, text}: {onLogin: (e: any) => void, text: string}) => {
    return <button
        className="login-button"
        style={{
            width: "200px",
            height: "35px",
            border: "none",
            color: "white",
            backgroundColor: Colors.RED_00,
            borderRadius: "5px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            fontWeight: "bolder",
            cursor: "pointer",
        }}
        onClick={onLogin}
    >{text}</button>
}

const ForgotPasswordButton = ({onForgotPassword}: {onForgotPassword: () => void}) => {
    return <button
        className="login-forgot-password-button"
        onClick={onForgotPassword}
        style={{
            border: "none",
            backgroundColor: "rgba(0,0,0,0)",
            color: Colors.LIGHT_GREY_00,
            cursor: "pointer"
        }}
    >Forgot password?</button>
}

export {
    LoginContainer,
    LoginImage,
    LoginContentContainer,
    LoginButton,
    ForgotPasswordButton
}