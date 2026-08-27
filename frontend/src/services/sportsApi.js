const API_URL = 'https://www.thesportsdb.com/api/v1/json/123'

export async function getAllSports() {
  try {
    const response = await fetch(`${API_URL}/all_sports.php`)
    if (!response.ok) throw new Error('Error al obtener deportes')
    const data = await response.json()
    return data.sports || []
  } catch (error) {
    console.error('Error en getAllSports:', error)
    throw error
  }
}