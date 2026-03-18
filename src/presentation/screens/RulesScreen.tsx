import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Switch, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Rule } from '../../domain/entities';
import { GetRulesUseCase, SaveRuleUseCase, UpdateRuleUseCase, DeleteRuleUseCase } from '../../application/useCases';
import { AsyncStorageRuleRepository } from '../../infrastructure/repositories';

type RootStackParamList = {
  Home: undefined;
  Rules: undefined;
  Config: undefined;
};

type RulesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rules'>;

interface Props {
  navigation: RulesScreenNavigationProp;
}

const RulesScreen: React.FC<Props> = ({ navigation }) => {
  const [rules, setRules] = useState<Rule[]>([]);

  const ruleRepo = new AsyncStorageRuleRepository();
  const getRulesUseCase = new GetRulesUseCase(ruleRepo);
  const saveRuleUseCase = new SaveRuleUseCase(ruleRepo);
  const updateRuleUseCase = new UpdateRuleUseCase(ruleRepo);
  const deleteRuleUseCase = new DeleteRuleUseCase(ruleRepo);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    const data = await getRulesUseCase.execute();
    setRules(data);
  };

  const addRule = () => {
    Alert.prompt('Add Rule', 'Enter name', async (name) => {
      if (name) {
        const rule: Rule = {
          id: Date.now().toString(),
          name,
          field: 'body',
          pattern: '',
          isRegex: false,
          isActive: true,
        };
        await saveRuleUseCase.execute(rule);
        loadRules();
      }
    });
  };

  const toggleActive = async (rule: Rule) => {
    const updated = { ...rule, isActive: !rule.isActive };
    await updateRuleUseCase.execute(updated);
    loadRules();
  };

  const deleteRule = async (id: string) => {
    await deleteRuleUseCase.execute(id);
    loadRules();
  };

  const renderItem = ({ item }: { item: Rule }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Switch value={item.isActive} onValueChange={() => toggleActive(item)} />
      <Button title="Delete" onPress={() => deleteRule(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add Rule" onPress={addRule} />
      <Button title="Back" onPress={() => navigation.goBack()} />
      <FlatList
        data={rules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1 },
});

export default RulesScreen;