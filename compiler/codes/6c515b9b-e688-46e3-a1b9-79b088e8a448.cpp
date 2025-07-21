#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

namespace CoinCollect {

using CoinRange = pair<pair<int, int>, int>;

vector<CoinRange> readCoinRanges(int n) {
  vector<CoinRange> coins;
  for (int i = 0; i < n; ++i) {
    int l, r, c;
    cin >> l >> r >> c;
    coins.emplace_back(make_pair(l, r), c);
  }
  return coin;
}

void sortCoinRanges(vector<CoinRange> &coins) {
  sort(coins.begin(), coins.end(), [](const CoinRange &a, const CoinRange &b) {
    if (a.first.first == b.first.first)
      return a.first.second < b.first.second;
    return a.first.first < b.first.first;
  });
}

long long simulateCoinCollection(const vector<CoinRange> &coins,
                                 long long initialCoins) {
  priority_queue<long long> pq;
  long long currentCoins = initialCoins;
  int idx = 0;
  int n = coins.size();

  while (true) {
    while (idx < n && coins[idx].first.first <= currentCoins) {
      pq.push(coins[idx].second);
      idx++;
    }
    while (!pq.empty() && pq.top() <= currentCoins) {
      pq.pop();
    }
    if (pq.empty())
      break;
    currentCoins = pq.top();
    pq.pop();
  }

  return currentCoins;
}
} // namespace CoinCollect

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  int t;
  cin >> t;
  while (t--) {
    int n, k;
    cin >> n >> k;

    auto coins = CoinCollect::readCoinRanges(n);
    CoinCollect::sortCoinRanges(coins);
    long long result = CoinCollect::simulateCoinCollection(coins, k);
    cout << result << '\n';
  }

  return 0;
}
