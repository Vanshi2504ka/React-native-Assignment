import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper'; // For card UI

const JobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      setJobs((prevJobs) => [...prevJobs, ...response.data.jobs]);
      setHasMore(response.data.jobs.length > 0);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const handleBookmark = async (job) => {
    const savedJobs = JSON.parse(await AsyncStorage.getItem('bookmarkedJobs')) || [];
    savedJobs.push(job);
    await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(savedJobs));
  };

  const renderJobCard = ({ item }) => (
    <Card onPress={() => navigation.navigate('JobDetails', { job: item })}>
      <View style={{ padding: 15 }}>
        <Text>{item.title}</Text>
        <Text>{item.location}</Text>
        <Text>{item.salary}</Text>
        <Text>{item.phone}</Text>
        <Button title="Bookmark" onPress={() => handleBookmark(item)} />
      </View>
    </Card>
  );

  return (
    <View>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        onEndReached={() => {
          if (hasMore && !loading) {
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator />}
      />
    </View>
  );
};

export { JobsScreen };
