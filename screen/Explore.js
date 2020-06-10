import React, { Component } from "react";
import {
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableHighlight
} from "react-native";
import styled from "styled-components/native";
import RNPickerSelect from "react-native-picker-select";
import Loader from '../components/loader'
import { emptyObj, titleFormat, idFormat } from "../helper";

export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPoke: [],
      maxData:null,
      searchText: "",
      type: [],
      pokeDetails: {},
      modalVisible: false,
      isLoading: false 
    };
    this.arrayHolder = [];
  }

  getAllPoke() {
    this.setState({isLoading:true})
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then(res => res.json())
      .then(data => {
        this.setState({ dataPoke: data.results, maxData: data.count });
        this.arrayHolder = data.results;
      })
      .catch(err => console.error(err))
      .finally(() => this.setState({ isLoading: false}));
  }

  convertDataType(data) {
    const newData = data.map(x => ({
      label: titleFormat(x.name),
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

  getPokeByName = (visible, name)=> {
    this.setState({isLoading:true})
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => res.json())
      .then(data => this.setState({ pokeDetails: data }))
      .catch(err => console.error(err))
      .finally(()=> this.setState({ isLoading: false, modalVisible:visible }))
  };

  typeDataFilter(data) {
    const newData = data.map(x => x.pokemon);
    this.setState({ dataPoke: newData });
    this.arrayHolder = newData;
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
    return nextProps.dataPoke !== this.state.dataPoke;
  }

  searchFilter = text => {
    const newData = this.arrayHolder.filter(item => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ dataPoke: newData });
  };

  setModalVisible = (visible, title) => {
    if (title) {
      this.getPokeByName(visible, title);
    }
    this.setState({modalVisible:false})
  };

  render() {
    const {
      dataPoke,
      maxData,
      pokeDetails,
      isLoading,
      searchText,
      type,
      modalVisible
    } = this.state;
    //console.log(dataPoke.length);
    //console.log(pokeDetails.sprites &&  pokeDetails.sprites.front_default, 'iiiiii')
    //console.log(pokeDetails && pokeDetails.name && titleFormat(pokeDetails.name))
    const Item = ({ title }) => {
      return (
        <TouchableOpacity onPress={() => this.setModalVisible(true, title)}>
          <ItemContainer>
            <Text>{titleFormat(title)}</Text>
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
            <Loader loading={isLoading}/>
          <FlatList
            data={dataPoke}
            renderItem={({ item }) => <Item title={item.name} />}
            keyExtractor={(item, idx) => idx.toString()}
          />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
            <ModalContainer>
              <Text>
                 {pokeDetails.id && idFormat(pokeDetails.id, maxData)} {pokeDetails.name && titleFormat(pokeDetails.name)}
              </Text>
              <ImageStyle
                source={{
                  uri: pokeDetails.sprites && pokeDetails.sprites.front_default
                }}
              />
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </ModalContainer>
        </Modal>
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
const ModalContainer = styled.View`
  margin: 20px;
  background-color: white;
  border-radius: 10;
  padding: 35px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 5;
`;
const ImageStyle = styled.Image`
  width: 150;
  height: 150;
  border-radius: 30;
`;
