import request from 'supertest';
import express from 'express';
import { projectsRouter } from './projectsRouter';
import { ProjectQueries } from './projects.queries';

jest.mock('./projects.queries');

const app = express();
app.use(express.json());
app.use('/api/projects', projectsRouter);

describe('Projects API', () => {
  let projectQueriesMock: jest.Mocked<ProjectQueries>;

  beforeEach(() => {
    projectQueriesMock = new ProjectQueries() as jest.Mocked<ProjectQueries>;
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }, { id: '2', name: 'Project 2' }];
      projectQueriesMock.getAllProjects.mockResolvedValue(mockProjects);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body.projects).toEqual(mockProjects);
    });

    it('should handle errors when fetching projects', async () => {
      projectQueriesMock.getAllProjects.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch projects');
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a project by ID', async () => {
      const mockProject = { id: '1', name: 'Project 1' };
      projectQueriesMock.getProjectById.mockResolvedValue(mockProject);

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body.project).toEqual(mockProject);
    });

    it('should return 404 if project not found', async () => {
      projectQueriesMock.getProjectById.mockResolvedValue(null);

      const response = await request(app).get('/api/projects/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Project not found');
    });

    it('should handle errors when fetching project by ID', async () => {
      projectQueriesMock.getProjectById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch project');
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const newProject = { id: '3', name: 'Project 3' };
      projectQueriesMock.createProject.mockResolvedValue(newProject);

      const response = await request(app)
        .post('/api/projects')
        .send({ name: 'Project 3' });

      expect(response.status).toBe(201);
      expect(response.body.project).toEqual(newProject);
    });

    it('should handle errors when creating a project', async () => {
      projectQueriesMock.createProject.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/projects')
        .send({ name: 'Project 3' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to create project');
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update an existing project', async () => {
      const updatedProject = { id: '1', name: 'Updated Project 1' };
      projectQueriesMock.updateProject.mockResolvedValue(updatedProject);

      const response = await request(app)
        .put('/api/projects/1')
        .send({ name: 'Updated Project 1' });

      expect(response.status).toBe(200);
      expect(response.body.project).toEqual(updatedProject);
    });

    it('should return 404 if project to update is not found', async () => {
      projectQueriesMock.updateProject.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/projects/999')
        .send({ name: 'Updated Project 999' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Project not found');
    });

    it('should handle errors when updating a project', async () => {
      projectQueriesMock.updateProject.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/projects/1')
        .send({ name: 'Updated Project 1' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to update project');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project', async () => {
      projectQueriesMock.deleteProject.mockResolvedValue(true);

      const response = await request(app).delete('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project deleted successfully');
    });

    it('should return 404 if project to delete is not found', async () => {
      projectQueriesMock.deleteProject.mockResolvedValue(false);

      const response = await request(app).delete('/api/projects/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Project not found');
    });

    it('should handle errors when deleting a project', async () => {
      projectQueriesMock.deleteProject.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/projects/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to delete project');
    });
  });
});