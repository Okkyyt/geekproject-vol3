import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Button } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

import MandalaChart from "./template/MandalaChart";
import MandalaChart99 from "./template/MandalaChart99"; // 新しく追加するコンポーネント
import WriteSvg from "./template/WriteSvg";
import TodoList from "./template/TodoList";
import Update from "../../views/CRUD/Update";
import ModalPage from "./ModalPage";
import Fotter from "../../page/Fotter";
function  ProjectPage({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();

  if (!item) {
    return (
      <View>
        <Text>プロジェクトは存在しません</Text>
      </View>
    );
  }

  const [pressId, setPressId] = useState(null);
  const [mandalaItem, setMandalaItem] = useState(item);
  const [modalVisible, setModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 新しく追加する状態

  const handleMandalaChecked = (index) => {
    const i = { ...mandalaItem };
    const subItems = i.mandala[index].mandala;
    const allTextFlagsTrue = subItems.every(
      (subItem) => !subItem.text || subItem.flag
    );

    if (allTextFlagsTrue) {
      i.mandala[index].flag = !i.mandala[index].flag;
    }
    setMandalaItem(i);
    Update(i);
  };

  const handleSmallMandalaChecked = (pressId, index) => {
    const i = { ...mandalaItem };
    const subItem = i.mandala.find((m) => m.id === pressId);
    subItem.mandala[index].flag = !subItem.mandala[index].flag;
    setMandalaItem(i);
    Update(i);
  };

  const handleMandala9x9Checked = (largeIndex, smallIndex) => {
    if (largeIndex === 4) {
      handleMandalaChecked(smallIndex);
    } else {
      handleSmallMandalaChecked(mandalaItem.mandala[largeIndex].id, smallIndex);
    }
  };

  const handleTodoChecked = (newTodos) => {
    const i = { ...mandalaItem };
    i.todo = newTodos;
    setMandalaItem(i);
    Update(i);
  };

  const handlePressId = (id) => {
    setPressId(id);
    setModalVisible(true);
  };

  const toggleMandala = () => {
    setIsExpanded(!isExpanded);
  };

  console.log(mandalaItem);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
           <Ionicons name="menu" size={30} color="black" style={styles.menuIcon} />
         </TouchableOpacity>
         <Text style={styles.title}>{item.name}</Text>
    </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Button onPress={toggleMandala}>
          {isExpanded ? "3x3に縮小" : "9x9に拡大"}
        </Button>
        <View style={styles.mandalaContainer}>
          {isExpanded ? (
            <MandalaChart99
              item={mandalaItem}
              handleChecked={handleMandala9x9Checked}
            />
          ) : (
            <MandalaChart
              item={mandalaItem}
              setPressId={handlePressId}
              goal={mandalaItem.goal}
              handleChecked={handleMandalaChecked}
            />
          )}
        </View>

        <View style={styles.chartContainer}>
          <WriteSvg item={item} />
        </View>
        <View>
          <TodoList item={item} handleChecked={handleTodoChecked} />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalPage
          pressId={pressId}
          mandalaItem={mandalaItem}
          handleSmallMandalaChecked={handleSmallMandalaChecked}
          setPressId={setPressId}
          setModalVisible={setModalVisible}
        />
      </Modal>
      <Fotter/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
      menuIcon: {
        marginRight: 15,
      },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  mandalaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
});

export default  ProjectPage;