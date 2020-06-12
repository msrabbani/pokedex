import React, { Component } from "react";
import {
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableHighlight
} from "react-native";
import styled from "styled-components/native";
import RNPickerSelect from "react-native-picker-select";
import Loader from "../components/loader";
import { emptyObj, titleFormat, idFormat } from "../helper";

export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPoke: [],
      maxData: null,
      searchText: "",
      type: [],
      pokeDetails: {},
      modalVisible: false,
      isLoading: false
    };
    this.arrayHolder = [];
  }

  getAllPoke() {
    this.setState({ isLoading: true });
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then(res => res.json())
      .then(data => {
        this.setState({ dataPoke: data.results, maxData: data.count });
        this.arrayHolder = data.results;
      })
      .catch(err => console.error(err))
      .finally(() => this.setState({ isLoading: false }));
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

  getPokeByName = (visible, name) => {
    this.setState({ isLoading: true });
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => res.json())
      .then(data => this.setState({ pokeDetails: data }))
      .catch(err => console.error(err))
      .finally(() =>
        this.setState({ isLoading: false, modalVisible: visible })
      );
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
    this.setState({ modalVisible: false });
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
        <HeadContainer>
          <TextInputWrapper>
            <TextinputStyle
              onChangeText={text => this.searchFilter(text)}
              underlineColorAndroid="transparent"
              placeholder="Search Pokemon"
            />
          </TextInputWrapper>
          <PickerWrapper>
            <RNPickerSelect
              onValueChange={value => this.typeValueChange(value)}
              items={type}
              itemKey={(item, idx) => idx.toString()}
            />
          </PickerWrapper>
        </HeadContainer>
        <Loader loading={isLoading} />
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
            <PokeId>
              {pokeDetails.id && idFormat(pokeDetails.id, maxData)}
            </PokeId>
            <PokeName>
              {pokeDetails.name && titleFormat(pokeDetails.name)}
            </PokeName>
            <ImageStyle
              source={{
                uri: pokeDetails.sprites && pokeDetails.sprites.front_default
              }}
            />
            <InfoContainer>
              <InfoWrapper>
                <InfoKey>Weight</InfoKey>
                <InfoValue>
                  {parseFloat(pokeDetails.weight * 0.1).toFixed(1)} Kg
                </InfoValue>
              </InfoWrapper>
              <InfoWrapper>
                <InfoKey>Height</InfoKey>
                <InfoValue>
                  {parseFloat(pokeDetails.height * 0.1).toFixed(1)} m
                </InfoValue>
              </InfoWrapper>
            </InfoContainer>
            <InfoContainer>
              <InfoWrapper>
                <InfoKey>Type</InfoKey>
                {pokeDetails.types &&
                  pokeDetails.types.map((data, idx) => {
                    return (
                      <TypeWrapper>
                        <InfoValue key={idx}>
                          {titleFormat(data.type.name)}
                        </InfoValue>
                      </TypeWrapper>
                    );
                  })}
              </InfoWrapper>
            </InfoContainer>
            <ButtonStyled
              onPress={() => {
                this.setModalVisible(!modalVisible);
              }}
            >
              <Text>Close</Text>
            </ButtonStyled>
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
const HeadContainer = styled.View`
  flex-direction: row;
  padding: 5px;
`;
const PickerWrapper = styled.View`
  background-color: #fff5ee;
  border-radius: 10px;
  justify-content:center;
  padding: 10px;
`
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
const TextInputWrapper = styled.View`
  border-bottom-color: #f5fcff;
  background-color: #ffffff;
  border-radius: 10;
  border-bottom-width: 1;
  width: 50%;
  flex-direction: row;
  align-items: center;
  margin-right:10px;
`;
const TextinputStyle = styled.TextInput`
  height: 35;
  margin-left: 16;
  border-bottom-color: #ffffff;
  flex: 1;
`;
const PokeId = styled.Text`
  color: grey;
  font-size: 20;
  font-weight: 600;
`;
const PokeName = styled.Text`
  font-size: 25;
  font-weight: 700;
`;
const ModalContainer = styled.View`
  margin: 20px;
  padding: 30px;
  background-color: #f0fff0;
  border-radius: 10;
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
const InfoContainer = styled.View`
  margin-vertical: 10px;
  flex-direction: row;
  border-radius: 5px;
`;
const InfoWrapper = styled.View`
  flex-grow: 1;
  align-items: center;
  padding: 10px;
`;
const InfoKey = styled.Text`
  font-size: 15px;
  margin: 5px;
`;
const InfoValue = styled.Text`
  font-size: 22px;
  font-weight: 600;
`;
const TypeWrapper = styled.View``;
const ButtonStyled = styled.TouchableOpacity`
  padding: 10px 35px 10px;
  background-color: pink;
  border-radius: 10px;
`;
