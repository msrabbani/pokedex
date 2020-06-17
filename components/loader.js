import React, { Component } from "react";
import { Modal, ActivityIndicator } from "react-native";
import styled from "styled-components/native";

export default Loader = props => {
  const { loading, ...attributes } = props;

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <ModalBackground>
        <IndicatorWrapper>
          <ActivityIndicator animating={loading} />
        </IndicatorWrapper>
      </ModalBackground>
    </Modal>
  );
};

const ModalBackground = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-around;
  background-color: #00000040;
`;

const IndicatorWrapper = styled.View`
  background-color: #ffffff;
  height: 100;
  width: 100;
  border-radius: 10;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
