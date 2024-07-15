import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";

function TodoList({ item, handleChecked }) {
  const [filter, setFilter] = useState("todo");
  const [todos, setTodos] = useState(item.todo || []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "todo") return !todo.flag;
    if (filter === "done") return todo.flag;
    if (filter === "all") return true;
    return true;
  });

  const handleTodoChecked = (index) => {
    const newTodos = [...todos];
    newTodos[index].flag = !newTodos[index].flag;
    setTodos(newTodos);
    handleChecked(newTodos);
  };

  return (
    <View>
      <Text style={styles.progressTitle}>達成状況</Text>
      <View style={styles.todoFilterContainer}>
        <TouchableOpacity onPress={() => setFilter("todo")}>
          <Text
            style={[
              styles.todoFilter,
              filter === "todo" && styles.activeFilter,
            ]}
          >
            やること
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("done")}>
          <Text
            style={[
              styles.todoFilter,
              filter === "done" && styles.activeFilter,
            ]}
          >
            完了
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text
            style={[
              styles.todoFilter,
              filter === "all" && styles.activeFilter,
            ]}
          >
            ToDo
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.todoContainer}>
        {filteredTodos.length === 0 ? (
          <Text style={styles.noTodosText}>該当するToDoがありません</Text>
        ) : (
          filteredTodos.map((todo, index) => (
            <View key={index} style={styles.todoItem}>
              <Text style={styles.todoText}>{todo.title}</Text>
              <Checkbox
                status={todo.flag ? "checked" : "unchecked"}
                onPress={() => handleTodoChecked(todos.indexOf(todo))}
                style={styles.todoCheckbox}
              />
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: '#333',
  },
  todoFilterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  todoFilter: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#888",
  },
  activeFilter: {
    color: "#000",
    fontWeight: "bold",
  },
  todoContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  noTodosText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
});

export default TodoList;