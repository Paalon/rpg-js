package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	data, err := ioutil.ReadFile(`test.msg`)
	if err != nil {
		// エラー処理
		fmt.Println("ファイルが読み込めないよ")
	}
	message := string(data)
	fmt.Print(message)

}
