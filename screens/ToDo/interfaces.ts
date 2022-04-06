// ToDo in Postman

export interface ToDoDataProps {
  id: string;
  title: string;
  notes: string;
  dueDate: string;
  priority: boolean;
  completedDate: string;
  isCampaign: boolean;
}

export interface ToDoDataResponse {
  data: ToDoDataProps[];
  error: string;
  status: string;
}
