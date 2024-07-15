import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Read from "../views/CRUD/Read";
import TaskPage from "../components/ShowTask/TaskPage";

export default function ShowTaskScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        await Read(setData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TaskPage data={data} />
  );
}
