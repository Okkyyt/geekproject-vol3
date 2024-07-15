import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "react-native-paper";

function CustomDrawerContent(props) {
  const { data } = props;
  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section>
        <DrawerItem
          label="新しいプロジェクトの作成"
          onPress={() => props.navigation.navigate("MakeProject")}
        />
        {data.map((item, index) => (
          <DrawerItem
            key={index}
            label={item.name}
            onPress={() => props.navigation.navigate(`Project_${index}`)}
          />
        ))}
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;