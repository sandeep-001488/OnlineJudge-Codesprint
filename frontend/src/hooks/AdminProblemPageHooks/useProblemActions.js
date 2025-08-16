
export const useProblemActions = (router) => {
  const slugify = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleCardClick = (problem) => {
    router.push(`/problems/${slugify(problem.title)}-${problem._id}`);
  };

  const handleView = (problem) => {
    router.push(`/problems/${slugify(problem.title)}-${problem._id}`);
  };

  const handleEdit = (problem) => {
    router.push(`/admin/problems/${problem._id}/edit`);
  };

  const handleTestCases = (problem) => {
    router.push(`/admin/problems/${problem._id}/testcases`);
  };

  const handleCreateClick = () => {
    router.push("/admin/problems/create");
  };

  return {
    handleCardClick,
    handleView,
    handleEdit,
    handleTestCases,
    handleCreateClick,
  };
};
