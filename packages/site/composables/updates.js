export const useGithubCommits = () => {
  const commits = ref([])
  const loading = ref(true)
  const error = ref(null)

  const fetchCommits = async () => {
    try {
      const response = await fetch(
        'https://api.github.com/repos/ohiosveryown/proportional.design/commits?per_page=3'
      )
      const data = await response.json()
      commits.value = data.map(commit => ({
        message: commit.commit.message,
        date: new Date(commit.commit.author.date).toLocaleDateString(),
        sha: commit.sha.substring(0, 7)
      }))
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCommits)

  return {
    commits,
    loading,
    error
  }
}