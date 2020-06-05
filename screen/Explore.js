import React, { Component } from "react";
import { ActivityIndicator, TouchableOpacity, FlatList } from "react-native";
import styled from "styled-components/native";
import RNPickerSelect from 'react-native-picker-select';

export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPoke: [],
      searchText: "",
      type: [],
      isLoading: true
    };
    this.arrayHolder = [];
  }

  getAllPoke() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then(res => res.json())
      .then(data => {
        this.setState({ dataPoke: data.results });
        this.arrayHolder = data.results;
      })
      .catch(err => console.error(err))
      .finally(() => this.setState({ isLoading: false }));
  }
  convertDataType(data){


  }

  getPokeType() {
    fetch("https://pokeapi.co/api/v2/type")
      .then(res => res.json())
      .then(data => this.setState({ type: data.results }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.getAllPoke();
    this.getPokeType();
  }

  searchFilter = text => {
    const newData = this.arrayHolder.filter(item => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ dataPoke: newData });
  };

  render() {
    const { dataPoke, isLoading, searchText, type } = this.state;
    console.log(type, "nih");
    const Item = ({ title }) => {
      return (
        <TouchableOpacity onPress={() => console.log(title)}>
          <ItemContainer>
            <Text>{title}</Text>
          </ItemContainer>
        </TouchableOpacity>
      );
    };

    return (
      <Container>
        <TextinputContainer>
          <TextinputStyle
            onChangeText={text => this.searchFilter(text)}
            underlineColorAndroid="transparent"
            placeholder="Search Pokemon"
          />
        </TextinputContainer>
        <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            items={type}
        />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={dataPoke}
            renderItem={({ item }) => <Item title={item.name} />}
            keyExtractor={(item, idx) => idx.toString()}
          />
        )}
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  background-color: #ebf0f7;
  padding: 10px;
`;
const ListWraper = styled.View`
  background-color: white;
`;
const Text = styled.Text`
  font-size: 15;
`;
const ItemContainer = styled.View`
  border-color: #dcdcdc;
  border-bottom-width: 1px;
  padding: 10px;
`;
const TextinputContainer = styled.View`
  border-bottom-color: #f5fcff;
  background-color: #ffffff;
  border-radius: 10;
  border-bottom-width: 1;
  width: 50%;
  flex-direction: row;
  align-items: center;
`;
const TextinputStyle = styled.TextInput`
  height: 35;
  margin-left: 16;
  border-bottom-color: #ffffff;
  flex: 1;
`;
