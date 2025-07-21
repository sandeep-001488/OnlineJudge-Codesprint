#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

vector<int> readInput(int n) {
  vector<int> towerHeights(n);
  for (int &height : towerHeights) {
    cin >> height;
  }
  return towerHeights;
}

vector<int> getUniqueSortedHeights(const vector<int> &towerHeights) {
  vector<int> uniqueHeights = towerHeights;
  sort(uniqueHeights.begin(), uniqueHeights.end());
  uniqueHeights.erase(unique(uniqueHeights.begin(), uniqueHeights.end()),
                      uniqueHeights.end());
  return uniqueHeights;
}

bool canReachMaxTower(int startIndex, const vector<int> &towerHeights) {
  int currentHeight = towerHeights[startIndex - 1];
  int maxHeight = *max_element(towerHeights.begin(), towerHeights.end());

  if (currentHeight == maxHeight) {
    return true;
  }

  vector<int> uniqueHeights = getUniqueSortedHeights(towerHeights);

  int currentPos =
      lower_bound(uniqueHeights.begin(), uniqueHeights.end(), currentHeight) -
      uniqueHeights.begin();

  for (int i = currentPos; i + 1 < (int)uniqueHeights.size(); ++i) {
    if (uniqueHeights[i + 1] - uniqueHeights[i] > currentHeight) {
      return false;
    }
  }

  return true;
}

void processTestCase() {
  int n, k;
  cin >> n >> k;
  vector<int> towerHeights = readInput(n);

  if (canReachMaxTower(k, towerHeights))
    cout << "yes" << endl;
  else
    cout << "NO" << endl;
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  int t;
  cin >> t;
  while (t--) {
    processTestCase();
  }

  return 0;
}
