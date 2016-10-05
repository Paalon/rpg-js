package main

import (
	"fmt"
	"io/ioutil"
	"os"
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
	rest := Keyword{"rest", "r"}
	wait := Keyword{"wait", "w"}
	clear := Keyword{"clear", "c"}
	end := Keyword{"end", "e"}
	sound := Keyword{"sound", "s"}
	time := Keyword{"time", "t"}

	keywords0 := []Keyword{
		line, rest, wait, clear, end,
	}

	keywords1 := []Keyword{
		sound, time,
	}

	message := string(data)
	// コメントを取り除く
	rep := regexp.MustCompile(`/\*[\s\S]*?\*/|//.*`)
	message = rep.ReplaceAllString(message, "")
	// 改行を取り除く
	message = strings.Replace(message, "\n", "", -1)

	// shortから先にパース
	for _, keyword := range keywords0 {
		rep := regexp.MustCompile(`\$` + keyword.Full + `|\$` + keyword.Short)
		message = rep.ReplaceAllString(message, "#"+keyword.Full+"#")
	}

	for _, keyword := range keywords1 {
		rep := regexp.MustCompile(`\$` + keyword.Full + `|\$` + keyword.Short)
		message = rep.ReplaceAllString(message, "#"+keyword.Full+"#")
	}

	// $$ -> $
	rep = regexp.MustCompile(`\$\$`)
	message = rep.ReplaceAllString(message, "$")

	fmt.Println(message)

	// 出力
	file, err := os.Create(`test.message`)
	if err != nil {
		// Openエラー処理
	}
	defer file.Close()

	output := message
	file.Write(([]byte)(output))
}
