package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func main() {
	data, err := ioutil.ReadFile(`test.msg`)
	if err != nil {
		// エラー処理
		fmt.Println("ファイルが読み込めないよ")
	}

	type Keyword struct {
		Full  string
		Short string
	}

	line := Keyword{"line", "l"}
	wait := Keyword{"wait", "w"}
	clear := Keyword{"clear", "c"}

	keywords := []Keyword{
		line, wait, clear,
	}

	message := string(data)
	// 改行を取り除く
	message = strings.Replace(message, "\n", "", -1)

	// shortから先にパース
	for _, keyword := range keywords {
		message = strings.Replace(message, "$"+keyword.Short, "$"+keyword.Full, -1)
		message = strings.Replace(message, "$"+keyword.Full, "$"+keyword.Full+"$", -1)
	}
	fmt.Println(message)
	/*
		slice := strings.Split(message, "$")
		for _, x := range slice {
			fmt.Println(x)
		}
	*/
}
