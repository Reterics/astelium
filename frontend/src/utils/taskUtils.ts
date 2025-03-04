


export const getInitialGroupedData = (key: string) => {

  switch (key) {
    case 'status':
      return {
        open: [],
        'in-progress': [],
        review: [],
        completed: [],
        closed: [],
      }
    case 'type':
      return {
        issue: [],
        task: [],
        feature: []
      }
    case 'priority':
      return {
        high: [],
        medium: [],
        low: []
      }
    default:
        return {}
  }
}
