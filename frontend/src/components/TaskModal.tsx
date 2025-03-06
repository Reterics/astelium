import Modal from './Modal';
import {useState} from 'react';
import SelectComponent, {SelectOptions} from './SelectComponent.tsx';
import {useApi} from '../hooks/useApi.ts';
import {Task} from './KanbanBoard.tsx';
import {FiMessageSquare} from 'react-icons/fi';

export interface TaskModalProps {
  task: Task;
  users: SelectOptions;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal = ({task, users, onClose, onSave}: TaskModalProps) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newComment, setNewComment] = useState('');

  const {
    data: comments,
    createMutation,
    isLoading: commentsLoading,
  } = useApi(`comments?task_id=${task.id}`);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await createMutation.mutateAsync({
      task_id: task.id,
      text: newComment,
      author: 'You', // Placeholder for now
      created_at: new Date().toISOString(),
    });
    setNewComment('');
  };

  const handleChange = (key: keyof Task, value: Task[keyof Task]) => {
    setEditedTask((prev) => ({...prev, [key]: value}));
  };

  return (
    <Modal
      title={
        <input
          type='text'
          value={editedTask.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className='w-full text-lg font-bold border-b border-zinc-300 focus:outline-none'
        />
      }
      onClose={onClose}
    >
      <div className='grid grid-cols-[2fr_1fr] gap-2'>
        <div className='space-y-3'>
          <textarea
            value={editedTask.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className='w-full h-20 border border-zinc-300 p-1 rounded text-sm'
            placeholder='Task description...'
          />

          <h4 className='text-lg font-bold'>Comments</h4>

          <div className='space-y-2 max-h-40 overflow-y-auto p-1 bg-zinc-50 rounded'>
            {commentsLoading ? (
              <p>Loading comments...</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className='border-b pb-1 flex items-start space-x-2'
                >
                  <div>
                    <p className='text-sm font-semibold'>{comment.author}</p>
                    <p className='text-sm'>{comment.text}</p>
                    <p className='text-xs text-gray-500 flex items-center space-x-2'>
                      <FiMessageSquare className='text-zinc-600' />
                      <span>
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <textarea
            className='w-full h-16 border border-zinc-300 p-1 rounded text-sm mb-1 bg-zinc-50'
            placeholder='Add a comment...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className='bg-zinc-800 text-white px-2 py-1 rounded-xs hover:bg-zinc-700'
            onClick={handleAddComment}
          >
            Post Comment
          </button>
        </div>

        <div className='bg-gray-100 p-2 rounded flex flex-col gap-1 text-sm space-y-1 w-full'>
          <div className='grid grid-cols-[1fr_1fr] items-center'>
            <span className='font-semibold'>Assigned to:</span>
            <SelectComponent
              defaultLabel='Select User'
              column={{
                key: 'assigned_to',
                label: 'Assigned To',
                type: 'select',
                options: users,
              }}
              filters={{assigned_to: editedTask.assigned_to!}}
              handleFilterChange={(_col, value) =>
                handleChange('assigned_to', value)
              }
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center'>
            <span className='font-semibold'>Start:</span>
            <input
              type='datetime-local'
              value={editedTask.start_time || ''}
              onChange={(e) => handleChange('start_time', e.target.value)}
              className='border border-zinc-300 p-1 rounded text-xs'
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center'>
            <span className='font-semibold'>Expected:</span>
            <input
              type='datetime-local'
              value={editedTask.expected_time || ''}
              onChange={(e) => handleChange('expected_time', e.target.value)}
              className='border border-zinc-300 p-1 rounded text-xs'
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center'>
            <span className='font-semibold'>Priority:</span>
            <SelectComponent
              defaultLabel='Select Priority'
              column={{key: 'priority', label: 'Priority', type: 'select'}}
              filters={{priority: editedTask.priority!}}
              handleFilterChange={(_col, value) =>
                handleChange('priority', value)
              }
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center'>
            <span className='font-semibold'>Story Pts:</span>
            <input
              type='number'
              value={editedTask.story_points || ''}
              onChange={(e) => handleChange('story_points', e.target.value)}
              className='border border-zinc-300 p-1 rounded w-12 text-xs place-self-end'
            />
          </div>

          <div className='flex flex-1'></div>
          <div className='self-end justify-items-end flex justify-end'>
            <button
              onClick={() => onSave(editedTask)}
              className='bg-zinc-800 text-white px-4 py-2 rounded-xs'
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
