package main

import (
	"fmt"
	"io/ioutil"
	"regexp"
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
	// コメントを取り除く
	// 改行を取り除く
	message = strings.Replace(message, "\n", "", -1)

	// shortから先にパース
	for _, keyword := range keywords {
		rep := regexp.MustCompile(`\$` + keyword.Full + `|\$` + keyword.Short)
		message = rep.ReplaceAllString(message, "#"+keyword.Full+"#")
	}
	fmt.Println(message)

	/*
		slice := strings.Split(message, "$")
		for _, x := range slice {
			fmt.Println(x)
		}
	*/
}
