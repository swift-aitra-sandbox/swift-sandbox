import { ProjectQueries } from './ProjectQueries';
import { db } from '../db';
import { jest } from '@jest/globals';

jest.mock('../db');

describe('ProjectQueries', () => {
  let projectQueries: ProjectQueries;

  beforeEach(() => {
    projectQueries = new ProjectQueries();
  });

  describe('getAllProjects', () => {
    it('should return all projects ordered by created_at in descending order', async () => {
      const mockProjects = [
        { id: '1', title: 'Project 1', description: 'Description 1', studentId: 'student1', status: 'draft', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Project 2', description: 'Description 2', studentId: 'student2', status: 'completed', createdAt: new Date(), updatedAt: new Date() }
      ];
      db.query.mockResolvedValue({ rows: mockProjects });

      const result = await projectQueries.getAllProjects();

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY created_at DESC'));
      expect(result).toEqual(mockProjects);
    });

    it('should return an empty array if no projects are found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await projectQueries.getAllProjects();

      expect(result).toEqual([]);
    });
  });

  describe('getProjectById', () => {
    it('should return a project when a valid ID is provided', async () => {
      const mockProject = { id: '1', title: 'Project 1', description: 'Description 1', studentId: 'student1', status: 'draft', createdAt: new Date(), updatedAt: new Date() };
      db.query.mockResolvedValue({ rows: [mockProject] });

      const result = await projectQueries.getProjectById('1');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), ['1']);
      expect(result).toEqual(mockProject);
    });

    it('should return null if no project is found with the given ID', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await projectQueries.getProjectById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('createProject', () => {
    it('should create a new project with the provided data', async () => {
      const mockProject = { id: '1', title: 'Project 1', description: 'Description 1', studentId: 'student1', status: 'draft', createdAt: new Date(), updatedAt: new Date() };
      const createData = { title: 'Project 1', description: 'Description 1', studentId: 'student1' };
      db.query.mockResolvedValue({ rows: [mockProject] });

      const result = await projectQueries.createProject(createData);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO projects'), [
        createData.title,
        createData.description,
        createData.studentId,
        'draft'
      ]);
      expect(result).toEqual(mockProject);
    });

    it('should use "draft" as default status if not provided', async () => {
      const mockProject = { id: '1', title: 'Project 1', description: 'Description 1', studentId: 'student1', status: 'draft', createdAt: new Date(), updatedAt: new Date() };
      const createData = { title: 'Project 1', description: 'Description 1', studentId: 'student1' };
      db.query.mockResolvedValue({ rows: [mockProject] });

      const result = await projectQueries.createProject(createData);

      expect(result.status).toBe('draft');
    });
  });

  describe('updateProject', () => {
    it('should update the project with the given data', async () => {
      const mockProject = { id: '1', title: 'Updated Project', description: 'Updated Description', studentId: 'student1', status: 'in_progress', createdAt: new Date(), updatedAt: new Date() };
      const updateData = { title: 'Updated Project', description: 'Updated Description', status: 'in_progress' };
      db.query.mockResolvedValue({ rows: [mockProject] });

      const result = await projectQueries.updateProject('1', updateData);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE projects'), ['1', ...Object.values(updateData)]);
      expect(result).toEqual(mockProject);
    });

    it('should return null if the project to update is not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await projectQueries.updateProject('non-existent-id', { title: 'New Title' });

      expect(result).toBeNull();
    });
  });

  describe('deleteProject', () => {
    it('should delete the project with the given ID and return true', async () => {
      db.query.mockResolvedValue({ rowCount: 1 });

      const result = await projectQueries.deleteProject('1');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM projects'), ['1']);
      expect(result).toBe(true);
    });

    it('should return false if the project to delete is not found', async () => {
      db.query.mockResolvedValue({ rowCount: 0 });

      const result = await projectQueries.deleteProject('non-existent-id');

      expect(result).toBe(false);
    });
  });
});