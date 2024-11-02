import ProjectList from '@components/projects';
import { getProjects } from '@lib/projects';

export const metadata = {
  title: 'Projects',
  description: 'Meus projetos mais interessantes',
  alternates: {
    canonical: 'https://victormesquita.dev/projects',
  },
};

const Projects = async () => {
  const projects = await getProjects();
  return <ProjectList showYears={true} projects={projects} seeMore={false} />;
};

export default Projects;
