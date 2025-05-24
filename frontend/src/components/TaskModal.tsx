import Modal from './Modal';
import {useState} from 'react';
import SelectComponent, {SelectOptions} from './SelectComponent.tsx';
import {useApi} from '../hooks/useApi.ts';
import {Task} from './KanbanBoard.tsx';
import {FiMessageSquare} from 'react-icons/fi';
import {addressAutocomplete} from '../utils/utils.ts';
import AutocompleteComponent from './AutocompleteComponent.tsx';
import {SkeletonText} from './ui/Skeleton.tsx';

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
          className='w-full text-xl font-bold border-b border-zinc-300 focus:outline-none focus:border-blue-500 py-1 transition-all'
        />
      }
      onClose={onClose}
    >
      <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mt-2'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                editedTask.type === 'feature'
                  ? 'bg-yellow-100 text-yellow-800'
                  : editedTask.type === 'task'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {editedTask.type.charAt(0).toUpperCase() +
                editedTask.type.slice(1)}
            </div>

            {editedTask.priority && (
              <div
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  editedTask.priority === 'low'
                    ? 'bg-blue-100 text-blue-800'
                    : editedTask.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {editedTask.priority.charAt(0).toUpperCase() +
                  editedTask.priority.slice(1)}{' '}
                Priority
              </div>
            )}

            <div
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                editedTask.status === 'open'
                  ? 'bg-blue-100 text-blue-800'
                  : editedTask.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : editedTask.status === 'review'
                      ? 'bg-purple-100 text-purple-800'
                      : editedTask.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
              }`}
            >
              {editedTask.status === 'in-progress'
                ? 'In Progress'
                : editedTask.status.charAt(0).toUpperCase() +
                  editedTask.status.slice(1)}
            </div>
          </div>

          <textarea
            value={editedTask.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className='w-full min-h-24 border border-zinc-200 bg-white px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            placeholder='Task description...'
          />

          <div className='mt-2'>
            <h4 className='text-sm font-bold text-zinc-800 mb-3 flex items-center'>
              <FiMessageSquare className='mr-2' /> Comments (
              {comments?.length || 0})
            </h4>

            <div className='space-y-3 max-h-60 overflow-y-auto p-4 bg-white border border-zinc-200 rounded-md shadow-sm'>
              {commentsLoading ? (
                <div className='p-4'>
                  <div className='flex items-start gap-3 mb-4'>
                    <SkeletonText className='w-8 h-8 rounded-full' />
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <SkeletonText className='w-24 h-4 mb-2' />
                        <SkeletonText className='w-16 h-3' />
                      </div>
                      <SkeletonText lines={2} />
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <SkeletonText className='w-8 h-8 rounded-full' />
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <SkeletonText className='w-24 h-4 mb-2' />
                        <SkeletonText className='w-16 h-3' />
                      </div>
                      <SkeletonText lines={1} />
                    </div>
                  </div>
                </div>
              ) : comments?.length === 0 ? (
                <div className='text-center py-6 text-zinc-500'>
                  <p className='text-sm'>No comments yet</p>
                  <p className='text-xs mt-1'>Be the first to add a comment</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className='border-b border-zinc-100 pb-3 flex items-start gap-3'
                  >
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-semibold text-zinc-900'>
                          {comment.author}
                        </p>
                        <span className='text-xs text-zinc-500'>
                          {new Date(comment.created_at).toLocaleString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                      </div>
                      <p className='text-sm text-zinc-800 mt-1'>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className='mt-3 bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm'>
              <textarea
                className='w-full min-h-20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                placeholder='Add a comment...'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className='bg-zinc-50 px-4 py-2 flex justify-between items-center border-t border-zinc-200'>
                <span className='text-xs text-zinc-500'>
                  Markdown supported
                </span>
                <button
                  className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col gap-4 p-4 w-full'>
          <h3 className='font-semibold text-zinc-800 text-sm border-b border-zinc-200 pb-2'>
            Task Details
          </h3>

          <div className='space-y-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-medium text-zinc-600'>
                Assigned to
              </label>
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

            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-zinc-600'>
                  Start Date
                </label>
                <input
                  type='datetime-local'
                  value={editedTask.start_time || ''}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  className='border border-zinc-200 px-3 py-2 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-zinc-600'>
                  Expected Date
                </label>
                <input
                  type='datetime-local'
                  value={editedTask.expected_time || ''}
                  onChange={(e) =>
                    handleChange('expected_time', e.target.value)
                  }
                  className='border border-zinc-200 px-3 py-2 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-zinc-600'>
                  Priority
                </label>
                <SelectComponent
                  defaultLabel='Select Priority'
                  column={{key: 'priority', label: 'Priority', type: 'select'}}
                  filters={{priority: editedTask.priority!}}
                  handleFilterChange={(_col, value) =>
                    handleChange('priority', value)
                  }
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-zinc-600'>
                  Story Points
                </label>
                <input
                  type='number'
                  value={editedTask.story_points || ''}
                  onChange={(e) => handleChange('story_points', e.target.value)}
                  className='border border-zinc-200 px-3 py-2 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-xs font-medium text-zinc-600'>
                Location
                {editedTask.lat && editedTask.lng && (
                  <span className='text-xs font-normal text-zinc-500 ml-1'>
                    ({editedTask.lat.toFixed(4)}, {editedTask.lng.toFixed(4)})
                  </span>
                )}
              </label>
              <AutocompleteComponent
                defaultLabel={
                  (editedTask.address as string | undefined) ||
                  `Select location`
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
          </div>

          <div className='flex-1' />
          <div className='flex justify-end pt-4 border-t border-zinc-200 mt-4'>
            <button
              onClick={() => onSave(editedTask)}
              className='bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors'
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
