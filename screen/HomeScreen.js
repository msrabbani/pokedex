import React from 'react'
import styled from 'styled-components/native'

export default function HomeScreen({navigation}) {
  return (
    <Container>
      <Text>Welcome to Pokedex!</Text>
      <Text>To get started, edit App.js</Text>
      <Button title="Explore" onPress={()=>navigation.push('Explore')} />
    </Container>
  )
}

const Container = styled.View`
  flex:1;
  background-color: pink;  
  align-items:center;
  justify-content:center;
`
const Text = styled.Text`
  font-size:24;
`
const Button = styled.Button``
