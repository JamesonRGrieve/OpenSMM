'use client';

import React, { useState, useEffect } from 'react';
import { postScheduledPost, getPosts, deletePost, getAccounts } from '@/lib/sdk'; // Adjust import path as needed
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'jrgcomponents/NewDialog';
import { useToast } from '@/components/ui/use-toast'; // Assuming you're using shadcn/ui toast

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [postDetails, setPostDetails] = useState({
    text: '',
    datetime: '',
    accounts: [],
    attachments: [],
  });

  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const accountsResult = await getAccounts();
      const postsResult = await getPosts();

      setAccounts(accountsResult);
      setPosts(postsResult.data);
    } catch (error) {
      toast.toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    }
  };

  const handleSchedulePost = async () => {
    // Validation checks
    if (postDetails.accounts.length === 0) {
      toast.toast({
        title: 'Validation Error',
        description: 'Please select at least 1 account',
      });
      return;
    }

    const scheduledDate = new Date(postDetails.datetime);
    const currentDate = new Date();

    if (!postDetails.datetime || scheduledDate < currentDate) {
      toast.toast({
        title: 'Invalid Date',
        description: 'Please select a valid future date and time',
      });
      return;
    }

    if (!postDetails.text && postDetails.attachments.length === 0) {
      toast.toast({
        title: 'Validation Error',
        description: 'Please add either text or media to your post',
      });
      return;
    }

    try {
      const result = await postScheduledPost({
        ...postDetails,
        accounts: selectedAccounts.map((acc) => acc._id),
      });

      if (result.status === 'success') {
        toast.toast({
          title: 'Success',
          description: result.message,
        });
        setIsNewPostOpen(false);
        loadDashboardData();
      } else {
        toast.toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast.toast({
        title: 'Error',
        description: 'Failed to schedule post',
        variant: 'destructive',
      });
    }
  };

  const renderPostStatusColor = (post) => {
    const statuses = post.data.map((d) => d.status.split(':')[0]);
    if (statuses.includes('pending')) return 'border-neutral-500';
    if (statuses.includes('posted')) return 'border-green-500';
    if (statuses.includes('error')) return 'border-red-500';
    return 'border-gray-300';
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Social Media Scheduler</h1>
        <button onClick={() => setIsNewPostOpen(true)}>Schedule a Post</button>
      </div>

      {/* Accounts Overview */}
      <div className='grid grid-cols-3 gap-4 mb-6'>
        {['facebook'].map((platform) => (
          <div key={platform} className='bg-blue-600 text-white p-4 rounded-lg text-center'>
            {/* <Icons.facebook className='w-10 h-10 mx-auto mb-2' /> */}
            <h2 className='text-xl font-bold'>{accounts.filter((a) => a.platform === platform).length}</h2>
            <p>{platform.charAt(0).toUpperCase() + platform.slice(1)} Accounts</p>
          </div>
        ))}
      </div>

      {/* Scheduled Posts */}
      <div className='space-y-4'>
        {posts.map((post) => (
          <div key={post._id} className={`border-r-4 p-4 bg-white shadow rounded ${renderPostStatusColor(post)}`}>
            <p>{post.text}</p>
            <p className='text-sm text-gray-500'>{new Date(post.datetime).toLocaleString()}</p>
            <button
              onClick={async () => {
                await deletePost(post._id);
                loadDashboardData();
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {/* 

      <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Post</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
