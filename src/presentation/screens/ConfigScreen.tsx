import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Config } from '../../domain/entities';
import { GetConfigUseCase, SaveConfigUseCase, SendTestMessageUseCase } from '../../application/useCases';
import { AsyncStorageConfigRepository } from '../../infrastructure/repositories';

type RootStackParamList = {
  Home: undefined;
  Rules: undefined;
  Config: undefined;
};

type ConfigScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Config'>;

interface Props {
  navigation: ConfigScreenNavigationProp;
}

const ConfigScreen: React.FC<Props> = ({ navigation }) => {
  const [config, setConfig] = useState<Config>({ botToken: '', chatId: '' });

  const configRepo = new AsyncStorageConfigRepository();
  const getConfigUseCase = new GetConfigUseCase(configRepo);
  const saveConfigUseCase = new SaveConfigUseCase(configRepo);
  const sendTestUseCase = new SendTestMessageUseCase(configRepo);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const data = await getConfigUseCase.execute();
    if (data) setConfig(data);
  };

  const saveConfig = async () => {
    await saveConfigUseCase.execute(config);
    Alert.alert('Saved');
  };

  const sendTest = async () => {
    const result = await sendTestUseCase.execute();
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  return (
    <View style={styles.container}>
      <Text>Bot Token:</Text>
      <TextInput
        style={styles.input}
        value={config.botToken}
        onChangeText={(text) => setConfig({ ...config, botToken: text })}
      />
      <Text>Chat ID:</Text>
      <TextInput
        style={styles.input}
        value={config.chatId}
        onChangeText={(text) => setConfig({ ...config, chatId: text })}
      />
      <Button title="Save" onPress={saveConfig} />
      <Button title="Send Test" onPress={sendTest} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8 },
});

export default ConfigScreen;