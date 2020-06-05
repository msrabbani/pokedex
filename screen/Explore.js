import React, { Component } from "react";
import { ActivityIndicator, TouchableOpacity, FlatList } from "react-native";
import styled from "styled-components/native";
import RNPickerSelect from "react-native-picker-select";

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

  convertDataType(data) {
    const newData = data.map(x => ({
      label: x.name,
      value: x.url
    }));
    this.setState({ type: newData });
  }

  getPokeType() {
    fetch("https://pokeapi.co/api/v2/type")
      .then(res => res.json())
      .then(data => this.convertDataType(data.results))
      .catch(err => console.log(err));
  }

  typeDataFilter(data){
    const newData = data.map( x => x.pokemon ) 
    this.setState({dataPoke: newData})
    this.arrayHolder = newData
  }

  typeValueChange = value => {
    fetch(value)
      .then(res => res.json())
      .then(data => this.typeDataFilter(data.pokemon)) 
      .catch(err => console.error(err));
  };

  componentDidMount() {
    this.getAllPoke();
    this.getPokeType();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.datePoke !== this.state.dataPoke
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
    console.log(dataPoke, 'dataPokee')
    dataPoke.length < 1 && <Text>data tidak ditemukan</Text>
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
          onValueChange={value => this.typeValueChange(value)}
          items={type}
          itemKey={(item, idx) => idx.toString()}
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
