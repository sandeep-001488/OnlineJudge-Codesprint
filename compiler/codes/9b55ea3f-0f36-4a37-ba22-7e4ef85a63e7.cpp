#include <algorithm>
#include <iostream>
#include <vector>


using namespace std;

int main() {
  int t;
  cin >> t;

  while (t--) {
    int n;
    cin >> n;
    vector<int> arr(n);

    for (int i = 0; i < n; i++) {
      cin >> arr[i];
    }

    if (n == 2 && arr[1] - arr[0] > 1)
      cout << "yes" << endl;
    else
      cout << "no" << endl;
  }

  return 0;
}
