export interface VisualizerModule {
  id: string;
  folderName: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  algorithmsCount: number;
  topics: string[];
  icon: string;
  port: number;
}
