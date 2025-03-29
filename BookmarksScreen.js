import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper'; // For card UI

const BookmarksScreen = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      const savedJobs = JSON.parse(await AsyncStorage.getItem('bookmarkedJobs')) || [];
      setBookmarkedJobs(savedJobs);
    };

    fetchBookmarkedJobs();
  }, []);

  const handleRemoveBookmark = async (job) => {
    const updatedJobs = bookmarkedJobs.filter((item) => item.id !== job.id);
    setBookmarkedJobs(updatedJobs);
    await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(updatedJobs));
  };

  const renderBookmarkCard = ({ item }) => (
    <Card>
      <View style={{ padding: 15 }}>
        <Text>{item.title}</Text>
        <Text>{item.location}</Text>
        <Text>{item.salary}</Text>
        <Text>{item.phone}</Text>
        <Button title="Remove Bookmark" onPress={() => handleRemoveBookmark(item)} />
      </View>
    </Card>
  );

  return (
    <View>
      <FlatList
        data={bookmarkedJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookmarkCard}
      />
    </View>
  );
};

export { BookmarksScreen };
