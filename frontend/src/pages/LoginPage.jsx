import React from 'react'
import { Container, VStack, Text, Button, Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './styling/login-page.css'
import homeLogo from '../images/Munyun-logo.png'

function LoginPage() {
  const { signIn, enableDemo } = useAuth()

  return (
    <div className="loginPage">
      <Container maxW="container.md" py={16}>
        <VStack spacing={6} className="loginCard">
          <img src={homeLogo} alt="Munyun" className="loginPageLogo" />
          <div className="loginHeader">
            <Link className="loginDemoBtn" to="/" onClick={enableDemo}>
              Try Demo
            </Link>
          </div>
          <div className="loginTitle">
            Welcome
          </div>
          <Text className="loginSubtitle">
            Sign in with Google to keep your budgets and expenses private.
          </Text>
          <Button className="munyun-btn loginBtn" onClick={signIn}>
            Continue with Google
          </Button>
          <Box className="loginHint">
            You can still explore the demo after signing in.
          </Box>
        </VStack>
      </Container>
    </div>
  )
}

export default LoginPage
