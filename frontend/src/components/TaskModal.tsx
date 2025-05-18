import Modal from './Modal';
import {useState} from 'react';
import SelectComponent, {SelectOptions} from './SelectComponent.tsx';
import {useApi} from '../hooks/useApi.ts';
import {Task} from './KanbanBoard.tsx';
import {FiMessageSquare} from 'react-icons/fi';
import {addressAutocomplete} from '../utils/utils.ts';
import AutocompleteComponent from './AutocompleteComponent.tsx';

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

  const handleChanges = (values: Record<keyof Task, unknown>) => {
    setEditedTask((prev) => ({...prev, ...values}) as Task);
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
      <div className='grid grid-cols-[2fr_1fr] gap-3'>
        <div className='flex flex-col gap-2'>
          <textarea
            value={editedTask.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className='w-full h-20 border border-zinc-200 bg-white px-2 py-1 text-xs font-medium rounded-none focus:outline-none focus:border-blue-500'
            placeholder='Task description...'
            style={{borderRadius: 0}}
          />

          <h4 className='text-xs font-bold text-zinc-800 mb-1 mt-2'>
            Comments
          </h4>

          <div
            className='space-y-1 max-h-40 overflow-y-auto p-1 bg-zinc-50 border border-zinc-100 rounded-none'
            style={{borderRadius: 0}}
          >
            {commentsLoading ? (
              <p className='text-xs text-zinc-700'>Loading comments...</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className='border-b border-zinc-100 pb-1 flex items-start gap-2'
                >
                  <div>
                    <p className='text-xs font-semibold text-zinc-900 mb-0'>
                      {comment.author}
                    </p>
                    <p className='text-xs text-zinc-800 mb-0'>{comment.text}</p>
                    <div className='flex items-center gap-1 text-[11px] text-zinc-600 mt-0.5'>
                      <FiMessageSquare className='w-3 h-3' />
                      <span>
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <textarea
            className='w-full h-14 border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium rounded-none focus:outline-none focus:border-blue-500 mt-1'
            placeholder='Add a comment...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{borderRadius: 0}}
          />
          <button
            className='bg-zinc-800 text-white px-3 py-1 rounded-none text-xs font-medium hover:bg-zinc-700 transition'
            onClick={handleAddComment}
            style={{borderRadius: 0}}
          >
            Post Comment
          </button>
        </div>

        <div
          className='bg-zinc-50 border border-zinc-100 rounded-none flex flex-col gap-1 text-xs px-2 py-2 w-full'
          style={{borderRadius: 0}}
        >
          <div className='grid grid-cols-[1fr_1fr] items-center gap-x-1'>
            <span className='font-semibold text-zinc-700'>Assigned to:</span>
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
          <div className='grid grid-cols-[1fr_1fr] items-center gap-x-1'>
            <span className='font-semibold text-zinc-700'>Start:</span>
            <input
              type='datetime-local'
              value={editedTask.start_time || ''}
              onChange={(e) => handleChange('start_time', e.target.value)}
              className='border border-zinc-200 px-2 py-1 bg-white rounded-none text-xs font-medium focus:outline-none focus:border-blue-500'
              style={{borderRadius: 0}}
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center gap-x-1'>
            <span className='font-semibold text-zinc-700'>Expected:</span>
            <input
              type='datetime-local'
              value={editedTask.expected_time || ''}
              onChange={(e) => handleChange('expected_time', e.target.value)}
              className='border border-zinc-200 px-2 py-1 bg-white rounded-none text-xs font-medium focus:outline-none focus:border-blue-500'
              style={{borderRadius: 0}}
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center gap-x-1'>
            <span className='font-semibold text-zinc-700'>Priority:</span>
            <SelectComponent
              defaultLabel='Select Priority'
              column={{key: 'priority', label: 'Priority', type: 'select'}}
              filters={{priority: editedTask.priority!}}
              handleFilterChange={(_col, value) =>
                handleChange('priority', value)
              }
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center gap-x-1'>
            <span className='font-semibold text-zinc-700'>Story Pts:</span>
            <input
              type='number'
              value={editedTask.story_points || ''}
              onChange={(e) => handleChange('story_points', e.target.value)}
              className='border border-zinc-200 px-2 py-1 bg-white rounded-none text-xs font-medium w-14 focus:outline-none focus:border-blue-500 place-self-end'
              style={{borderRadius: 0}}
            />
          </div>
          <div className='grid grid-cols-[1fr_1fr] items-center gap-x-1'>
            <span className='font-semibold text-zinc-700'>
              Address{' '}
              <span className='font-light'>
                ({(editedTask.lat || '') + ' - ' + (editedTask.lng || '')})
              </span>
              :
            </span>
            <AutocompleteComponent
              defaultLabel={
                (editedTask.address as string | undefined) || `Select option`
              }
              column={{key: 'address', label: 'Address', type: 'address'}}
              filter={async (input: string) => {
                return await addressAutocomplete(input).then(
                  (autoCompleteData) =>
                    autoCompleteData.map((data) => ({
                      label: data.display_name,
                      value: `{"lat":${data.lat},"lng":${data.lon},"address":"${data.display_name}"}`,
                    }))
                );
              }}
              filters={{address: editedTask.address as string}}
              handleFilterChange={(_column, value) => {
                if (!value) return;
                const data = JSON.parse(value);
                handleChanges(data);
              }}
            />
          </div>

          <div className='flex-1' />
          <div className='flex justify-end pt-2'>
            <button
              onClick={() => onSave(editedTask)}
              className='bg-zinc-800 text-white px-4 py-1 rounded-none text-xs font-medium hover:bg-zinc-700 transition'
              style={{borderRadius: 0}}
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
