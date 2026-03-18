import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SMS } from '../../domain/entities';
import { GetSMSLogsUseCase } from '../../application/useCases';
import { AsyncStorageSMSRepository } from '../../infrastructure/repositories';
import { SMSService, BackgroundTaskService } from '../../infrastructure/services';
import { AsyncStorageRuleRepository, AsyncStorageConfigRepository } from '../../infrastructure/repositories';
import { CheckRulesUseCase, SaveSMSLogUseCase, ForwardSMSUseCase } from '../../application/useCases';

type RootStackParamList = {
  Home: undefined;
  Rules: undefined;
  Config: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [logs, setLogs] = useState<SMS[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const smsRepo = new AsyncStorageSMSRepository();
  const ruleRepo = new AsyncStorageRuleRepository();
  const configRepo = new AsyncStorageConfigRepository();
  const saveSMSLogUseCase = new SaveSMSLogUseCase(smsRepo);
  const checkRulesUseCase = new CheckRulesUseCase(ruleRepo);
  const forwardUseCase = new ForwardSMSUseCase(checkRulesUseCase, configRepo, saveSMSLogUseCase);
  const smsService = new SMSService(forwardUseCase);
  const backgroundService = new BackgroundTaskService(smsService);

  const getSMSLogsUseCase = new GetSMSLogsUseCase(smsRepo);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await getSMSLogsUseCase.execute();
    setLogs(data);
  };

  const startService = async () => {
    const granted = await smsService.requestPermissions();
    if (granted) {
      await backgroundService.start();
      setIsRunning(true);
    }
  };

  const stopService = async () => {
    await backgroundService.stop();
    setIsRunning(false);
  };

  const renderItem = ({ item }: { item: SMS }) => (
    <View style={styles.item}>
      <Text>{item.sender}: {item.body.substring(0, 50)}...</Text>
      <Text>{item.timestamp.toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
      {item.errorMessage && <Text>Error: {item.errorMessage}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>Service: {isRunning ? 'Running' : 'Stopped'}</Text>
      <Button title={isRunning ? 'Stop Service' : 'Start Service'} onPress={isRunning ? stopService : startService} />
      <Button title="Rules" onPress={() => navigation.navigate('Rules')} />
      <Button title="Config" onPress={() => navigation.navigate('Config')} />
      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 8, borderBottomWidth: 1 },
});

export default HomeScreen;