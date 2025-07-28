#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main() {
     int n;
     cin>>n;
    vector<int>arr(n);
  for(auto &x:arr)cin>>x;
  int sum=accumulate(arr.begin(),arr.end(),0);
  
  
    cout << sum << endl;
    return 0;
}